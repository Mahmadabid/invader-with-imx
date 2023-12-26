// Copyright Immutable Pty Ltd 2018 - 2023
// SPDX-License-Identifier: Apache 2.0
pragma solidity 0.8.20;

import "./ERC721/abstract/ImmutableERC721Base.sol";

contract ShipsMint is ImmutableERC721Base {
    uint256 private _totalMint;
    mapping(uint256 => string) private _tokenLevels;
    
    uint256[] private _tokenIds;

    event TokenLevelUpdated(uint256 indexed tokenId, string newLevel);

    ///     =====   Constructor  =====

    /**
     * @notice Grants `DEFAULT_ADMIN_ROLE` to the supplied `owner` address
     * @param owner_ The address to grant the `DEFAULT_ADMIN_ROLE` to
     * @param name_ The name of the collection
     * @param symbol_ The symbol of the collection
     * @param baseURI_ The base URI for the collection
     * @param contractURI_ The contract URI for the collection
     * @param operatorAllowlist_ The address of the operator allowlist
     * @param royaltyReceiver_ The address of the royalty receiver
     * @param feeNumerator_ The royalty fee numerator
     * @dev the royalty receiver and amount (this can not be changed once set)
     */
    constructor(
        address owner_,
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        string memory contractURI_,
        address operatorAllowlist_,
        address royaltyReceiver_,
        uint96 feeNumerator_
    )
        ImmutableERC721Base(owner_, name_, symbol_, baseURI_, contractURI_, operatorAllowlist_, royaltyReceiver_, feeNumerator_)
    {}

    /** @notice Allows minter to mint `tokenID` to `to`
     *  @param to the address to mint the token to
     *  @param tokenID the ID of the token to mint
     */
    function safeMint(address to, uint256 tokenID) external onlyRole(MINTER_ROLE) {
        _totalMint++;
        _totalSupply++;
        _safeMint(to, tokenID, "");

        _setTokenLevel(tokenID, "1");
    }

    /** @notice Allows minter to mint `tokenID` to `to`
     *  @param to the address to mint the token to
     *  @param tokenID the ID of the token to mint
     */
    function mint(address to, uint256 tokenID) external onlyRole(MINTER_ROLE) {
        _totalMint++;
        _totalSupply++;
        _mint(to, tokenID);

        _setTokenLevel(tokenID, "1");
    }

    /**
     * @notice Get the total number of NFTs minted
     * @return Total mint count
     */
    function getTotalMint() external view returns (uint256) {
        return _totalMint;
    }

    /**
     * @notice Allows minter to safe mint a batch of tokens to a specified list of addresses
     * @param mintRequests an array of IDmint requests with the token IDs and address to mint to
     */
    function safeMintBatch(IDMint[] calldata mintRequests) external onlyRole(MINTER_ROLE) {
        for (uint256 i = 0; i < mintRequests.length; i++) {
            _safeBatchMint(mintRequests[i]);
        }
    }

    function getTokenLevel(uint256 tokenID) external view returns (string memory) {
        return _tokenLevels[tokenID];
    }

    function setTokenLevel(uint256 tokenID, string memory newLevel) external {
        _setTokenLevel(tokenID, newLevel);
    }

    function _setTokenLevel(uint256 tokenId, string memory newLevel) internal {
        if (!_tokenExists(tokenId)) {
            _tokenIds.push(tokenId);
        }

        _tokenLevels[tokenId] = newLevel;

        emit TokenLevelUpdated(tokenId, newLevel);
    }

    function getAllTokenLevelsAndIds() external view returns (uint256[] memory, string[] memory) {
        uint256[] memory tokenIds = new uint256[](_tokenIds.length);
        string[] memory levels = new string[](_tokenIds.length);

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            tokenIds[i] = _tokenIds[i];
            levels[i] = _tokenLevels[_tokenIds[i]];
        }

        return (tokenIds, levels);
    }

    function _tokenExists(uint256 tokenId) internal view returns (bool) {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            if (_tokenIds[i] == tokenId) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Allows minter to mint a batch of tokens to a specified list of addresses
     * @param mintRequests an array of IDmint requests with the token IDs and address to mint to
     */
    function mintBatch(IDMint[] calldata mintRequests) external onlyRole(MINTER_ROLE) {
        for (uint256 i = 0; i < mintRequests.length; i++) {
            _batchMint(mintRequests[i]);
        }
    }

    /**
     * @notice Allows owner or operator to burn a batch of tokens
     * @param tokenIDs an array of token IDs to burn
     */
    function burnBatch(uint256[] calldata tokenIDs) external {
        for (uint i = 0; i < tokenIDs.length; i++) {
            burn(tokenIDs[i]);
        }
    }

    /**
     * @notice Burn a batch of tokens, checking the owner of each token first.
     * @param burns an array of IDBurn requests with the token IDs and address to burn from
     */
    function safeBurnBatch(IDBurn[] calldata burns) external {
        _safeBurnBatch(burns);
    }

    /** @notice Allows caller to a transfer a number of tokens by ID from a specified
     *  address to a number of specified addresses
     *  @param tr the TransferRequest struct containing the from, tos, and tokenIds
     */
    function safeTransferFromBatch(TransferRequest calldata tr) external {
        if (tr.tokenIds.length != tr.tos.length) {
            revert IImmutableERC721MismatchedTransferLengths();
        }

        for (uint i = 0; i < tr.tokenIds.length; i++) {
            safeTransferFrom(tr.from, tr.tos[i], tr.tokenIds[i]);
        }
    }
}
