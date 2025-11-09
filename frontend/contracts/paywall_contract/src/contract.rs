use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, token,
    Address, Env, String, Symbol,
};

const NATIVE_TOKEN: Symbol = symbol_short!("NATIVE");

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InvalidPrice = 1,
    PostAlreadyExists = 2,
    PostNotFound = 3,
    PostNotActive = 4,
    AlreadyHasAccess = 5,
    Unauthorized = 6,
    NativeTokenNotConfigured = 7,
    AdminNotSet = 8,
}

#[contracttype]
#[derive(Clone)]
pub struct PostData {
    pub creator: Address,
    pub price: i128,
    pub destination: Address,
    pub created_at: u64,
    pub is_active: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct AccessRecord {
    pub user: Address,
    pub paid_amount: i128,
    pub paid_at: u64,
    pub transaction_id: String,
}

#[contract]
pub struct PaywallContract;

#[contractimpl]
impl PaywallContract {
    pub fn initialize(env: Env, admin: Address, native_token: Address) {
        admin.require_auth();
        
        let admin_key = symbol_short!("ADMIN");
        env.storage().instance().set(&admin_key, &admin);
        env.storage().instance().set(&NATIVE_TOKEN, &native_token);
    }

    pub fn create_post(
        env: Env,
        creator: Address,
        post_id: String,
        price: i128,
        destination: Address,
    ) -> Result<(), Error> {
        creator.require_auth();

        if price <= 0 {
            return Err(Error::InvalidPrice);
        }

        let post_key = (symbol_short!("POST"), post_id.clone());

        if env.storage().persistent().has(&post_key) {
            return Err(Error::PostAlreadyExists);
        }

        let post_data = PostData {
            creator: creator.clone(),
            price,
            destination: destination.clone(),
            created_at: env.ledger().timestamp(),
            is_active: true,
        };

        env.storage().persistent().set(&post_key, &post_data);

        Ok(())
    }

    pub fn pay_for_access(
        env: Env,
        post_id: String,
        payer: Address,
    ) -> Result<(), Error> {
        payer.require_auth();

        let post_key = (symbol_short!("POST"), post_id.clone());
        let post_data: PostData = env
            .storage()
            .persistent()
            .get(&post_key)
            .ok_or(Error::PostNotFound)?;

        if !post_data.is_active {
            return Err(Error::PostNotActive);
        }

        let access_key = (symbol_short!("ACCESS"), post_id.clone(), payer.clone());
        if env.storage().persistent().has(&access_key) {
            return Err(Error::AlreadyHasAccess);
        }

        let token_address: Address = env
            .storage()
            .instance()
            .get(&NATIVE_TOKEN)
            .ok_or(Error::NativeTokenNotConfigured)?;

        let token = token::Client::new(&env, &token_address);
        token.transfer(&payer, &post_data.destination, &post_data.price);

        let access_record = AccessRecord {
            user: payer.clone(),
            paid_amount: post_data.price,
            paid_at: env.ledger().timestamp(),
            transaction_id: String::from_str(&env, "internal"),
        };

        env.storage().persistent().set(&access_key, &access_record);

        let counter_key = (symbol_short!("COUNT"), post_id.clone());
        let current_count: u32 = env.storage().persistent().get(&counter_key).unwrap_or(0);
        env.storage().persistent().set(&counter_key, &(current_count + 1));

        Ok(())
    }

    pub fn register_external_payment(
        env: Env,
        post_id: String,
        payer: Address,
        transaction_id: String,
    ) -> Result<(), Error> {
        let admin_key = symbol_short!("ADMIN");
        let admin: Address = env
            .storage()
            .instance()
            .get(&admin_key)
            .ok_or(Error::AdminNotSet)?;
        admin.require_auth();

        let post_key = (symbol_short!("POST"), post_id.clone());
        let post_data: PostData = env
            .storage()
            .persistent()
            .get(&post_key)
            .ok_or(Error::PostNotFound)?;

        if !post_data.is_active {
            return Err(Error::PostNotActive);
        }

        let access_key = (symbol_short!("ACCESS"), post_id.clone(), payer.clone());
        if env.storage().persistent().has(&access_key) {
            return Ok(());
        }

        let access_record = AccessRecord {
            user: payer.clone(),
            paid_amount: post_data.price,
            paid_at: env.ledger().timestamp(),
            transaction_id,
        };

        env.storage().persistent().set(&access_key, &access_record);

        let counter_key = (symbol_short!("COUNT"), post_id.clone());
        let current_count: u32 = env.storage().persistent().get(&counter_key).unwrap_or(0);
        env.storage().persistent().set(&counter_key, &(current_count + 1));

        Ok(())
    }

    pub fn has_access(env: Env, post_id: String, user: Address) -> bool {
        let access_key = (symbol_short!("ACCESS"), post_id, user);
        env.storage().persistent().has(&access_key)
    }

    pub fn get_post(env: Env, post_id: String) -> Option<PostData> {
        let post_key = (symbol_short!("POST"), post_id);
        env.storage().persistent().get(&post_key)
    }

    pub fn get_access_record(
        env: Env,
        post_id: String,
        user: Address,
    ) -> Option<AccessRecord> {
        let access_key = (symbol_short!("ACCESS"), post_id, user);
        env.storage().persistent().get(&access_key)
    }

    pub fn deactivate_post(env: Env, post_id: String, caller: Address) -> Result<(), Error> {
        caller.require_auth();

        let post_key = (symbol_short!("POST"), post_id.clone());
        let mut post_data: PostData = env
            .storage()
            .persistent()
            .get(&post_key)
            .ok_or(Error::PostNotFound)?;

        if post_data.creator != caller {
            return Err(Error::Unauthorized);
        }

        post_data.is_active = false;
        env.storage().persistent().set(&post_key, &post_data);

        Ok(())
    }

    pub fn get_payment_count(env: Env, post_id: String) -> u32 {
        let counter_key = (symbol_short!("COUNT"), post_id);
        env.storage().persistent().get(&counter_key).unwrap_or(0)
    }

    pub fn update_price(
        env: Env,
        post_id: String,
        caller: Address,
        new_price: i128,
    ) -> Result<(), Error> {
        caller.require_auth();

        if new_price <= 0 {
            return Err(Error::InvalidPrice);
        }

        let post_key = (symbol_short!("POST"), post_id.clone());
        let mut post_data: PostData = env
            .storage()
            .persistent()
            .get(&post_key)
            .ok_or(Error::PostNotFound)?;

        if post_data.creator != caller {
            return Err(Error::Unauthorized);
        }

        post_data.price = new_price;
        env.storage().persistent().set(&post_key, &post_data);

        Ok(())
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, token, Address, Env, String};

    fn create_token_contract<'a>(env: &Env, admin: &Address) -> token::Client<'a> {
        let token_address = env.register_stellar_asset_contract(admin.clone());
        token::Client::new(env, &token_address)
    }

    #[test]
    fn test_create_post() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let creator = Address::generate(&env);
        let destination = Address::generate(&env);

        let token = create_token_contract(&env, &admin);

        let contract_id = env.register_contract(None, PaywallContract);
        let client = PaywallContractClient::new(&env, &contract_id);

        client.initialize(&admin, &token.address);

        let post_id = String::from_str(&env, "post_123");
        client.create_post(&creator, &post_id, &5_000_000, &destination);

        let post_data = client.get_post(&post_id).unwrap();
        assert_eq!(post_data.price, 5_000_000);
        assert_eq!(post_data.creator, creator);
    }

    #[test]
    fn test_pay_for_access() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let creator = Address::generate(&env);
        let payer = Address::generate(&env);
        let destination = Address::generate(&env);

        let token = create_token_contract(&env, &admin);
        token.mint(&payer, &10_000_000);

        let contract_id = env.register_contract(None, PaywallContract);
        let client = PaywallContractClient::new(&env, &contract_id);

        client.initialize(&admin, &token.address);

        let post_id = String::from_str(&env, "post_123");
        client.create_post(&creator, &post_id, &5_000_000, &destination);

        assert_eq!(client.has_access(&post_id, &payer), false);

        client.pay_for_access(&post_id, &payer);

        assert_eq!(client.has_access(&post_id, &payer), true);

        let balance = token.balance(&destination);
        assert_eq!(balance, 5_000_000);

        assert_eq!(client.get_payment_count(&post_id), 1);
    }
}
