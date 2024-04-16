use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::Sysvar;
use anchor_spl::token::{self, TokenAccount, Transfer};

declare_id!("4QNvhRvenGyUqfz1EdgUtPkPo5LSQ62KAKxZWV9caQBE");

#[program]
pub mod safe_shipping {

    use super::*;

    // Function to create a project by a client
    pub fn create_project(
        ctx: Context<CreateProject>,
        description: String,
        budget: u64,
    ) -> Result<()> {
        let project_account = &mut ctx.accounts.project_account;
        let client_account = &mut ctx.accounts.client_account;

        project_account.id = ctx.accounts.authority.key().to_bytes()[..8]
            .try_into()
            .ok()
            .and_then(|arr| u64::from_le_bytes(arr).checked_add(1))
            .unwrap_or_default();
        project_account.client_name = client_account.client_name.clone();
        project_account.description = description;
        project_account.budget = budget;
        project_account.state = ProjectState::Open as u8; 

        Ok(())
    }

    // Function to close a project
    pub fn close_project(ctx: Context<CloseProject>) -> Result<()> {
        let project_account = &mut ctx.accounts.project_account;
        project_account.state = ProjectState::Closed as u8;
        Ok(())
    }

    // Function to register a freelancer
    pub fn register_freelancer(
        ctx: Context<RegisterFreelancer>,
        freelancer_name: String,
    ) -> Result<()> {
        let freelancer_account = &mut ctx.accounts.freelancer_account;
        freelancer_account.freelancer_name = freelancer_name.clone(); 

        Ok(())
    }

    // Function to assign a project to a freelancer and fix the price (requires both client and freelancer signatures)
pub fn assign_project(ctx: Context<AssignProject>, freelancer_pub_key: Pubkey, agreed_price: Option<u64>) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;
    let client_account = &mut ctx.accounts.client_account;
    let freelancer_account = &mut ctx.accounts.freelancer_account;

    // Ensure project is open
    if project_account.state != ProjectState::Open as u8 {
        return Err(ErrorCode::ProjectNotOpen.into());
    }

    // Check if client signs
    if !client_account.key().eq(&ctx.accounts.authority.key()) {
        return Err(ProgramError::MissingRequiredSignature.into());
    }

    // Validate freelancer public key matches the account
    if !freelancer_pub_key.eq(&freelancer_account.key()) {
        return Err(ErrorCode::InvalidFreelancer.into());
    }

    // Initialize the assigned_freelancer field before assignment
    project_account.freelancer_name = String::default(); 

    // Access the freelancer's public key from the context
    project_account.freelancer_name = freelancer_pub_key.to_string();

    // Update the agreed-upon price if provided
    project_account.agreed_price = agreed_price;

    // Update the project state to "InProgress"
    project_account.state = ProjectState::InProgress as u8;

    Ok(())
}

    // Function to mark project as completed (requires client signature)
    pub fn complete_project(ctx: Context<CompleteProject>, amount: u64) -> Result<()> {
        let project_account = &mut ctx.accounts.project_account;
        let client_account = &mut ctx.accounts.client_account;
        let freelancer_account = &mut ctx.accounts.freelancer_account;
        // Ensure project is in progress and client signs
        if project_account.state != ProjectState::InProgress as u8
            || !client_account.key().eq(&ctx.accounts.authority.key())
        {
            return Err(ProgramError::InvalidInstructionData.into());
        }

        // Transfer tokens from client to freelancer
        token::transfer(
    CpiContext::new(
        ctx.accounts.token_program.clone(),
        Transfer {
            from: ctx.accounts.client_wallet.to_account_info(),
            to: ctx.accounts.freelancer_wallet.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        },
    ),
    amount,
)?;

        project_account.state = ProjectState::Closed as u8;

        Ok(())
    }
}


#[derive(Accounts)]
pub struct CreateProject<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 256 + 8 + 4, 
        seeds = [b"project", authority.key().as_ref()], 
        bump
    )]
    pub project_account: Account<'info, ProjectAccount>,

    #[account(mut)]
    pub client_account: Account<'info, ClientAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseProject<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub project_account: Account<'info, ProjectAccount>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct CompleteProject<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // Client

    #[account(mut)]
    pub project_account: Account<'info, ProjectAccount>,

    #[account(mut)]
    pub client_account: Account<'info, ClientAccount>,

    #[account(mut)]
    pub freelancer_account: Account<'info, FreelancerAccount>, // Freelancer

    #[account(mut)] // Token account of the client
    pub client_wallet: Account<'info, TokenAccount>,

    #[account(mut)] // Token account of the freelancer
    pub freelancer_wallet: Account<'info, TokenAccount>,

    #[account(address = token::ID)] // The token program ID
    pub token_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct AssignProject<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // Client

    #[account(mut)]
    pub project_account: Account<'info, ProjectAccount>,

    #[account(mut)]
    pub client_account: Account<'info, ClientAccount>,

    #[account(mut)]
    pub freelancer_account: Account<'info, FreelancerAccount>, // Freelancer

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterFreelancer<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + 32, 
        seeds = [b"user", authority.key().as_ref()], 
        bump
    )]
    pub freelancer_account: Account<'info, FreelancerAccount>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct ProjectAccount {
    pub id: u64,
    pub client_name: String,
    pub description: String,
    pub budget: u64,
    pub state: u8,               
    pub freelancer_name: String, 
    pub agreed_price: Option<u64>, 
}

#[account]
#[derive(Default)]
pub struct ClientAccount {
    pub client_name: String,
}

#[account]
#[derive(Default)]
pub struct FreelancerAccount {
    pub freelancer_name: String,
    pub rating: u8,
}

#[repr(u8)]
#[derive(Debug, PartialEq)]
pub enum ProjectState {
    Open = 0,
    Closed = 1,
    InProgress = 2,
}

#[derive(Debug, PartialEq)]
pub enum ErrorCode {
    ProjectNotOpen,
    InvalidFreelancer,
}

impl From<ErrorCode> for anchor_lang::error::Error {
    fn from(error: ErrorCode) -> Self {
        match error {
            ErrorCode::ProjectNotOpen => anchor_lang::error::Error::from(ProgramError::Custom(0)),
            ErrorCode::InvalidFreelancer => {
                anchor_lang::error::Error::from(ProgramError::Custom(1))
            }
        }
    }
}
