# Subgraph → Envio HyperIndex Query Migration

## Objective

Migrate Graph Subgraph GraphQL queries to Envio HyperIndex GraphQL.

Do **not** perform blind string replacements. HyperIndex uses Hasura-style GraphQL and differs from Subgraph in entity naming, filters, ordering, relationships, interfaces, variables, and `_meta`.

---

## 1. Entity Names

### Collection queries

```graphql
userTransactions(first: 10)
```

→

```graphql
UserTransaction(limit: 10)
```

Resolve the actual HyperIndex entity name from the Envio schema. Do not assume simple singularization is always correct.

### Primary-key queries

```graphql
launch(id: $id)
```

→

```graphql
Launch_by_pk(id: $id)
```

Preserve the original response field/alias if the migration layer requires the old response shape.

---

## 2. Pagination

| Subgraph | HyperIndex |
| -------- | ---------- |
| `first`  | `limit`    |
| `skip`   | `offset`   |

Example:

```graphql
launches(first: $first, skip: $skip)
```

→

```graphql
Launch(limit: $limit, offset: $offset)
```

Use `limit` and `offset` variable names for the corresponding HyperIndex arguments.

---

## 3. Filters

Subgraph uses suffix operators. HyperIndex uses nested Hasura operators.

| Subgraph       | HyperIndex             |
| -------------- | ---------------------- |
| `field: value` | `field: {_eq: value}`  |
| `field_not`    | `field: {_neq: value}` |
| `field_gt`     | `field: {_gt: value}`  |
| `field_gte`    | `field: {_gte: value}` |
| `field_lt`     | `field: {_lt: value}`  |
| `field_lte`    | `field: {_lte: value}` |
| `field_in`     | `field: {_in: value}`  |
| `field_not_in` | `field: {_nin: value}` |

Example:

```graphql
where: {
  amount_gt: 100
}
```

→

```graphql
where: {
  amount: {_gt: 100}
}
```

### Multiple conditions on the same field

Do not emit duplicate GraphQL object keys.

```graphql
where: {
  timestamp_gte: $from
  timestamp_lte: $to
}
```

→ use `_and`:

```graphql
where: {
  _and: [
    {timestamp: {_gte: $from}}
    {timestamp: {_lte: $to}}
  ]
}
```

---

## 4. String Filters

| Subgraph                   | HyperIndex                   |
| -------------------------- | ---------------------------- |
| `field_contains`           | `field: {_ilike: "%value%"}` |
| `field_starts_with`        | `field: {_ilike: "value%"}`  |
| `field_ends_with`          | `field: {_ilike: "%value"}`  |
| `field_contains_nocase`    | `field: {_ilike: "%value%"}` |
| `field_starts_with_nocase` | `field: {_ilike: "value%"}`  |
| `field_ends_with_nocase`   | `field: {_ilike: "%value"}`  |

Negated versions:

```graphql
field_not_contains
field_not_starts_with
field_not_ends_with
```

→

```graphql
_not: {
  field: {_ilike: "..."}
}
```

### Semantic warning

The converter maps `_contains` to `_ilike`, which is case-insensitive. This may differ from Subgraph `_contains` semantics.

Flag such queries for review rather than claiming exact semantic equivalence.

---

## 5. Relationship Filters

Subgraph may compare a relationship directly to an ID:

```graphql
where: {
  pair: $pairId
}
```

HyperIndex must filter through the relationship's `id`:

```graphql
where: {
  pair: {
    id: {_eq: $pairId}
  }
}
```

Likewise:

```graphql
pair_in: $ids
```

→

```graphql
pair: {
  id: {_in: $ids}
}
```

Determine whether a field is a relationship from the HyperIndex schema.

---

## 6. Nested Relationship Filters

Subgraph:

```graphql
where: {
  pair: {
    token: {
      symbol: "USDC"
    }
  }
}
```

→ HyperIndex:

```graphql
where: {
  pair: {
    token: {
      symbol: {_eq: "USDC"}
    }
  }
}
```

Resolve relationship types from the HyperIndex schema.

Subgraph relationship filter fields using a trailing `_`, e.g.:

```graphql
pair_: {...}
```

should become the actual relationship:

```graphql
pair: {...}
```

---

## 7. Logical Filters

Translate:

```text
and → _and
or  → _or
not → _not
```

For filter variables, transform the JSON variable value as well as the GraphQL variable type.

Example:

```graphql
query Q($where: Trade_filter!) {
  trades(where: $where) {
    id
  }
}
```

→

```graphql
query Q($where: Trade_bool_exp!) {
  Trade(where: $where) {
    id
  }
}
```

And:

```json
{
  "where": {
    "amount_gt": "100"
  }
}
```

→

```json
{
  "where": {
    "amount": {
      "_gt": "100"
    }
  }
}
```

Do not only rename `*_filter` to `*_bool_exp`; the runtime variable value must also be transformed.

---

## 8. Variable Types

Convert Subgraph scalar types:

```text
ID          → String
Bytes       → String
BigInt      → numeric
BigDecimal  → numeric
```

Preserve nullability and list structure.

Examples:

```graphql
$ids: [ID!]!
```

→

```graphql
$ids: [String!]!
```

```graphql
$amounts: [BigInt!]!
```

→

```graphql
$amounts: [numeric!]!
```

If a variable's declared type does not match the HyperIndex field type, change the variable declaration to the field's actual type.

This applies particularly to:

- numeric fields
- enum fields

---

## 9. Filter Type Names

```graphql
Entity_filter
```

→

```graphql
Entity_bool_exp
```

Examples:

```text
Trade_filter!       → Trade_bool_exp!
[Trade_filter!]!    → [Trade_bool_exp!]!
```

Only rewrite actual entity filter types.

---

## 10. Ordering

Subgraph:

```graphql
orderBy: timestamp
orderDirection: desc
```

→:

```graphql
order_by: {timestamp: desc}
```

Example:

```graphql
launches(
  orderBy: createdAt
  orderDirection: desc
)
```

→

```graphql
Launch(
  order_by: {createdAt: desc}
)
```

Default direction is `asc` when `orderDirection` is absent.

---

## 11. Nested Ordering

Subgraph:

```graphql
orderBy: pool__reserveUSD
```

→:

```graphql
order_by: {
  pool: {
    reserveUSD: asc
  }
}
```

Split `__` into nested relationship objects.

---

## 12. Variable-Based Ordering

Subgraph:

```graphql
query Q($orderBy: Trade_orderBy!, $direction: OrderDirection!) {
  trades(orderBy: $orderBy, orderDirection: $direction) {
    id
  }
}
```

HyperIndex requires an `order_by` input object/list rather than a dynamic object key.

Retype the order variable to:

```graphql
[Trade_order_by!]
```

and transform its runtime value.

Example:

```json
{
  "orderBy": "timestamp",
  "direction": "desc"
}
```

→:

```json
{
  "orderBy": [{ "timestamp": "desc" }]
}
```

---

## 13. Ordering

Order by fields that represent the intended sort. Do not append an opaque `id` as a tie-breaker by default: IDs may be addresses, transaction hashes, or composite keys, whose lexical order has no user-facing meaning. Add a tie-breaker only when paginating across server-side `limit`/`offset` requests requires deterministic traversal and the chosen field has suitable ordering semantics. Current client queries fetch a fixed result set from offset zero and paginate that set locally.

---

## 14. Interfaces

HyperIndex does not expose Subgraph interfaces in the same way.

Subgraph:

```graphql
userTransactions {
  id

  ... on Supply {
    amount
  }

  ... on Borrow {
    borrowRateMode
  }
}
```

HyperIndex stand-in relationships may be:

```graphql
UserTransaction {
  id
  supply: Supply
  borrow: Borrow
}
```

Rewrite:

```graphql
... on Supply {
  amount
}
```

→:

```graphql
_on_Supply: supply {
  amount
}
```

Rewrite:

```graphql
... on Borrow {
  borrowRateMode
}
```

→:

```graphql
_on_Borrow: borrow {
  borrowRateMode
}
```

Then reshape the response by hoisting the matching `_on_*` object into the parent row and removing the temporary alias.

Do not invent interface mappings. Resolve the implementing relationship from the HyperIndex schema.

---

## 15. Named Fragments

Handle both:

```graphql
... on Supply { ... }
```

and:

```graphql
fragment SupplyFields on Supply {
  amount
}
```

Named fragments on implementing interface types must also be routed through the corresponding HyperIndex relationship.

Nested fragments must preserve their structure.

---

## 16. `__typename`

For interface conversions, preserve Subgraph semantics.

If:

```graphql
... on Supply { ... }
```

matches the row, the resulting:

```graphql
__typename
```

should represent:

```text
Supply
```

not the HyperIndex interface stand-in.

Do not invent `__typename` if it was not requested.

---

## 17. `_meta`

Supported Subgraph:

```graphql
_meta {
  block {
    number
  }
}
```

can map to:

```graphql
chain_metadata {
  latest_fetched_block_number
}
```

and the response can be reconstructed into the original `_meta.block.number` shape.

Do not silently drop unsupported `_meta` fields.

Treat queries requesting unsupported metadata such as:

```text
block.timestamp
hasIndexingErrors
```

as requiring manual migration.

Do not combine `_meta` with normal entity roots unless the target implementation explicitly supports that combination.

---

## 18. Block / Time-Travel Queries

Queries using historical block arguments such as:

```graphql
block: {
  number: ...
}
```

are not automatically equivalent in HyperIndex.

Flag them for manual migration.

Do not fake historical-query support through normal HyperIndex queries.

---

## 19. Directives

Preserve GraphQL directives such as:

```graphql
@include
@skip
```

and their arguments.

Pay particular attention to:

```graphql
@include(if: $condition)
@skip(if: $condition)
```

because query sanitization/conversion must not remove directive arguments.

If the conversion mechanism cannot safely preserve a directive, flag the query for manual migration.

---

## 20. Chain ID

If the HyperIndex schema is multi-chain and exposes `chainId`, queries may require:

```graphql
where: {
  chainId: {_eq: "<chain-id>"}
}
```

Do not add `chainId` blindly.

First determine whether the target HyperIndex schema uses `chainId` and whether the migration endpoint/configuration supplies it.

---

## 21. Response Compatibility

If maintaining the existing Subgraph API contract, restore:

- original root field names
- aliases
- `_meta` shape
- interface fragment shape
- `__typename`

Internally HyperIndex may return:

```text
Launch
Launch_by_pk
_on_Supply
chain_metadata
```

while the existing client expects:

```text
launches
launch
fragment fields directly on the interface row
_meta
```

Perform response transformation only when compatibility with the existing client is required.

---

# Migration Procedure

For every Subgraph query:

1. Parse the operation and variables.
2. Resolve every root entity against the HyperIndex schema.
3. Convert root entity names.
4. Convert `first` → `limit`.
5. Convert `skip` → `offset`.
6. Convert `where` filters.
7. Resolve relationship filters through `id`.
8. Convert nested filters recursively.
9. Convert logical operators.
10. Convert filter variable types and runtime values.
11. Convert scalar variable types.
12. Convert enum/numeric variable types when required by the target schema.
13. Convert `orderBy`/`orderDirection`.
14. Convert nested ordering.
15. Handle variable-based ordering.
16. Add a meaningful tie-breaker only when pagination requires one.
17. Convert primary-key queries to `_by_pk`.
18. Rewrite interface fragments using actual HyperIndex relationships.
19. Preserve named fragments.
20. Handle `_meta` explicitly.
21. Flag block/time-travel queries.
22. Preserve directives.
23. Add `chainId` only when required by the target schema.
24. Transform the response if Subgraph-compatible output is required.

---

# Do Not

- Do not blindly singularize entity names.
- Do not blindly replace `_filter` with `_bool_exp` without transforming the variable value.
- Do not treat relationships as scalar fields.
- Do not translate `_in` on relationships directly; filter through `id`.
- Do not create duplicate GraphQL object keys when multiple filters target the same field.
- Do not assume `_contains` has identical case semantics.
- Do not silently discard unsupported filters.
- Do not silently discard `_meta` fields.
- Do not fake historical/block queries.
- Do not assume HyperIndex interfaces behave like Subgraph interfaces.
- Do not modify response shape unless compatibility requires it.
- Do not claim semantic equivalence where the target behavior differs.

# Validation

After migration, verify each query for:

1. GraphQL syntax.
2. Target schema compatibility.
3. Variable declaration compatibility.
4. Variable JSON compatibility.
5. Filter semantics.
6. Relationship semantics.
7. Ordering semantics.
8. Pagination determinism.
9. Interface/fragment behavior.
10. Response shape.

For every query that cannot be safely transformed, **flag it with the exact reason instead of guessing**.
