// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Voucher NFT Contract
 * @dev Internet/Power vouchers as NFTs for Silver Umbrella DePIN network
 * Each voucher represents prepaid access to internet or power services
 */
contract VoucherNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private voucherCounter;

    struct VoucherData {
        uint256 id;
        string planId;
        string code;
        uint256 durationHours;
        bool isActive;
        uint256 createdAt;
        uint256 activatedAt;
        address originalOwner;
    }

    mapping(uint256 => VoucherData) public vouchers;
    mapping(string => bool) private usedCodes;

    event VoucherMinted(
        uint256 indexed voucherId,
        address indexed owner,
        string planId,
        string code,
        uint256 durationHours
    );
    event VoucherActivated(uint256 indexed voucherId, uint256 timestamp);
    event VoucherTransferred(uint256 indexed voucherId, address from, address to);

    constructor() ERC721("SilverUmbrellaVoucher", "SUV") Ownable(msg.sender) {
        voucherCounter = 0;
    }

    /**
     * @dev Mint a new voucher NFT
     * @param planId Plan identifier
     * @param code Unique voucher code
     * @param durationHours Duration of service in hours
     * @param owner Address to receive the voucher
     */
    function mintVoucher(
        string memory planId,
        string memory code,
        uint256 durationHours,
        address owner
    ) external onlyOwner returns (uint256) {
        require(owner != address(0), "Owner cannot be zero address");
        require(bytes(planId).length > 0, "Plan ID cannot be empty");
        require(bytes(code).length > 0, "Code cannot be empty");
        require(!usedCodes[code], "Voucher code already used");
        require(durationHours > 0, "Duration must be greater than 0");

        voucherCounter++;
        uint256 newVoucherId = voucherCounter;

        vouchers[newVoucherId] = VoucherData({
            id: newVoucherId,
            planId: planId,
            code: code,
            durationHours: durationHours,
            isActive: false,
            createdAt: block.timestamp,
            activatedAt: 0,
            originalOwner: owner
        });

        usedCodes[code] = true;
        _safeMint(owner, newVoucherId);

        // Generate metadata URI
        string memory uri = _generateTokenURI(newVoucherId);
        _setTokenURI(newVoucherId, uri);

        emit VoucherMinted(newVoucherId, owner, planId, code, durationHours);
        return newVoucherId;
    }

    /**
     * @dev Activate a voucher
     * @param voucherId ID of the voucher to activate
     */
    function activateVoucher(uint256 voucherId) external {
        require(_ownerOf(voucherId) != address(0), "Voucher does not exist");
        require(ownerOf(voucherId) == msg.sender, "Not voucher owner");
        require(!vouchers[voucherId].isActive, "Voucher already active");

        vouchers[voucherId].isActive = true;
        vouchers[voucherId].activatedAt = block.timestamp;

        emit VoucherActivated(voucherId, block.timestamp);
    }

    /**
     * @dev Get voucher details
     * @param voucherId ID of the voucher
     */
    function getVoucher(uint256 voucherId) external view returns (VoucherData memory) {
        require(_ownerOf(voucherId) != address(0), "Voucher does not exist");
        return vouchers[voucherId];
    }

    /**
     * @dev Get total number of vouchers
     */
    function getVoucherCount() external view returns (uint256) {
        return voucherCounter;
    }

    /**
     * @dev Check if a voucher code has been used
     * @param code Voucher code to check
     */
    function isCodeUsed(string memory code) external view returns (bool) {
        return usedCodes[code];
    }

    /**
     * @dev Override transfer to emit custom event
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            emit VoucherTransferred(tokenId, from, to);
        }
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Generate metadata URI for voucher
     */
    function _generateTokenURI(uint256 voucherId) private view returns (string memory) {
        VoucherData memory voucher = vouchers[voucherId];
        
        // Create JSON metadata
        string memory json = string(abi.encodePacked(
            '{"name": "Silver Umbrella Voucher #',
            voucherId.toString(),
            '",',
            '"description": "Internet/Power access voucher for ',
            voucher.durationHours.toString(),
            ' hours",',
            '"attributes": [',
                '{"trait_type": "Plan ID", "value": "', voucher.planId, '"},',
                '{"trait_type": "Code", "value": "', voucher.code, '"},',
                '{"trait_type": "Duration (hours)", "value": ', voucher.durationHours.toString(), '},',
                '{"trait_type": "Active", "value": ', voucher.isActive ? 'true' : 'false', '}',
            ']}'
        ));

        // Base64 encode the JSON
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(bytes(json))
        ));
    }

    /**
     * @dev Base64 encode helper
     */
    function _base64Encode(bytes memory data) private pure returns (string memory) {
        bytes memory TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        
        if (data.length == 0) return "";
        
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        bytes memory result = new bytes(encodedLen);
        
        uint256 j = 0;
        for (uint256 i = 0; i < data.length; i += 3) {
            uint256 a = uint8(data[i]);
            uint256 b = i + 1 < data.length ? uint8(data[i + 1]) : 0;
            uint256 c = i + 2 < data.length ? uint8(data[i + 2]) : 0;
            
            result[j++] = TABLE[(a >> 2) & 0x3F];
            result[j++] = TABLE[((a & 0x03) << 4) | ((b >> 4) & 0x0F)];
            result[j++] = i + 1 < data.length ? TABLE[((b & 0x0F) << 2) | ((c >> 6) & 0x03)] : bytes1("=");
            result[j++] = i + 2 < data.length ? TABLE[c & 0x3F] : bytes1("=");
        }
        
        return string(result);
    }
}
