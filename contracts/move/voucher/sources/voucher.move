// Voucher NFT Module - OneChain Move Contract
module voucher::voucher_nft {
    use one::object::{Self, UID};
    use one::tx_context::{Self, TxContext};
    use one::transfer;
    use one::event;
    use std::string::{Self, String};

    /// Voucher NFT
    struct Voucher has key, store {
        id: UID,
        plan_id: String,
        code: String,
        duration_hours: u64,
        is_active: bool,
        created_at: u64,
        activated_at: u64,
        original_owner: address,
    }

    /// Event when voucher is minted
    struct VoucherMinted has copy, drop {
        voucher_id: address,
        plan_id: String,
        code: String,
        owner: address,
    }

    /// Event when voucher is activated
    struct VoucherActivated has copy, drop {
        voucher_id: address,
        activated_at: u64,
    }

    /// Mint a new voucher NFT
    public entry fun mint_voucher(
        plan_id: vector<u8>,
        code: vector<u8>,
        duration_hours: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let voucher = Voucher {
            id: object::new(ctx),
            plan_id: string::utf8(plan_id),
            code: string::utf8(code),
            duration_hours,
            is_active: false,
            created_at: tx_context::epoch_timestamp_ms(ctx),
            activated_at: 0,
            original_owner: sender,
        };

        let voucher_addr = object::id_address(&voucher);
        
        event::emit(VoucherMinted {
            voucher_id: voucher_addr,
            plan_id: string::utf8(plan_id),
            code: string::utf8(code),
            owner: sender,
        });

        transfer::transfer(voucher, sender);
    }

    /// Activate a voucher
    public entry fun activate_voucher(
        voucher: &mut Voucher,
        ctx: &mut TxContext
    ) {
        assert!(!voucher.is_active, 0); // Ensure not already active
        
        voucher.is_active = true;
        voucher.activated_at = tx_context::epoch_timestamp_ms(ctx);

        let voucher_addr = object::id_address(voucher);
        
        event::emit(VoucherActivated {
            voucher_id: voucher_addr,
            activated_at: voucher.activated_at,
        });
    }

    /// Transfer voucher to another address
    public entry fun transfer_voucher(
        voucher: Voucher,
        recipient: address,
        _ctx: &mut TxContext
    ) {
        transfer::transfer(voucher, recipient);
    }
}
