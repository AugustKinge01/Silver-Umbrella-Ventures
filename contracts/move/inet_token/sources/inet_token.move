// INET Token Module - OneChain Move Contract
module inet_token::inet_token {
    use one::coin::{Self, Coin, TreasuryCap};
    use one::tx_context::{Self, TxContext};
    use one::transfer;
    use one::object::{Self, UID};

    /// The INET token type
    struct INET_TOKEN has drop {}

    /// Module initializer is called once on module publish
    fun init(witness: INET_TOKEN, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness,
            8, // decimals
            b"INET",
            b"Internet Token",
            b"Silver Umbrella Internet Access Token",
            option::none(),
            ctx
        );
        
        // Transfer the treasury cap and metadata to the publisher
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
    }

    /// Mint new INET tokens (only treasury cap holder can call)
    public entry fun mint(
        treasury: &mut TreasuryCap<INET_TOKEN>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let coin = coin::mint(treasury, amount, ctx);
        transfer::public_transfer(coin, recipient);
    }

    /// Burn INET tokens
    public entry fun burn(
        treasury: &mut TreasuryCap<INET_TOKEN>,
        coin: Coin<INET_TOKEN>
    ) {
        coin::burn(treasury, coin);
    }
}
