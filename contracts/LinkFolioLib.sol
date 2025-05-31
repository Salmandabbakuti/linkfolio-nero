// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

library LinkFolioLib {
    using Strings for uint256;

    // category enum to string conversion
    function categoryToString(
        uint8 category
    ) internal pure returns (string memory) {
        if (category == 0) return "Personal";
        if (category == 1) return "Creator";
        if (category == 2) return "Business";
        return "Unknown";
    }

    // Helper function to join bytes in an array with a delimiter
    function bytesJoin(
        bytes[] memory parts,
        bytes memory delimiter
    ) internal pure returns (bytes memory) {
        if (parts.length == 0) return "";
        bytes memory output = parts[0];
        for (uint256 i = 1; i < parts.length; i++) {
            output = abi.encodePacked(output, delimiter, parts[i]);
        }
        return output;
    }

    // Generate tokenURI JSON metadata for a profile
    function generateTokenURI(
        uint256 tokenId,
        string memory name,
        string memory handle,
        string memory bio,
        string memory avatar,
        uint8 category,
        bytes[] memory attributesArray
    ) internal pure returns (string memory) {
        string memory categoryStr = categoryToString(category);

        attributesArray[0] = abi.encodePacked(
            '{"trait_type":"name", "value":"',
            name,
            '"}'
        );
        attributesArray[1] = abi.encodePacked(
            '{"trait_type":"handle", "value":"',
            handle,
            '"}'
        );
        attributesArray[2] = abi.encodePacked(
            '{"trait_type":"bio", "value":"',
            bio,
            '"}'
        );
        attributesArray[3] = abi.encodePacked(
            '{"trait_type":"tokenId", "value":"',
            tokenId.toString(),
            '"}'
        );

        attributesArray[4] = abi.encodePacked(
            '{"trait_type":"category", "value":"',
            categoryStr,
            '"}'
        );

        // Convert attributes array to JSON format
        bytes memory attributesJson = abi.encodePacked(
            "[",
            bytesJoin(attributesArray, ","),
            "]"
        );

        bytes memory metadataJson = abi.encodePacked(
            '{"name":"',
            name,
            '", "description":"',
            bio,
            '", "image":"',
            avatar,
            '", "external_url":"",',
            '"attributes":',
            attributesJson,
            "}"
        );

        // Encode the JSON metadata to Base64 and return the token URI
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(metadataJson)
                )
            );
    }
}
