use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::Sysvar;
use anchor_spl::token::{self, TokenAccount, Transfer}; // Updated import

// Your program Id will be added here when you enter "build" command
declare_id!("9Co1FRwR4mL1houAH1qFXE6tsj3D7z6cKfySEEiSiBFa");

#[program]
pub mod safe_shipping {

    use super::*;
    // Function to register a client
    pub fn register_client(
        ctx: Context<RegisterClient>,
        id: u64,
        client_name: String,
    ) -> Result<()> {
        let client_account = &mut ctx.accounts.client_account;
        client_account.id = id;
        client_account.client_name = client_name.clone(); // Use the function parameter
        msg!(
            "client name and id are {:?} {:?}",
            client_account.client_name,
            client_account.id
        );
        Ok(())
    }

    // Function to create a project by a client
    pub fn create_project(
        ctx: Context<CreateProject>,
        id: u64,
        description: String,
        budget: u64,
    ) -> Result<()> {
        let project_account = &mut ctx.accounts.project_account;
        let client_account = &mut ctx.accounts.client_account;

        project_account.id = id;
        project_account.client_name = client_account.client_name.clone();
        project_account.description = description;
        project_account.budget = budget;
        project_account.agreed_price = budget;
        project_account.state = ProjectState::Open as u8; // Convert enum to u8

        Ok(())
    }

    // Function to register a freelancer
    pub fn register_freelancer(
        ctx: Context<RegisterFreelancer>,
        id: u64,
        freelancer_name: String,
    ) -> Result<()> {
        let freelancer_account = &mut ctx.accounts.freelancer_account;
        freelancer_account.id = id;
        freelancer_account.freelancer_name = freelancer_name; // Use the function parameter
        msg!(
            "freelancer name and id are {:?} {:?}",
            freelancer_account.freelancer_name,
            freelancer_account.id
        );
        Ok(())
    }

    pub fn assign_project(
        ctx: Context<AssignProject>,
        freelancer_name: String,
        agreed_price: u64,
        _id: u64,
    ) -> Result<()> {
        let project_account = &mut ctx.accounts.project_account;

        // Ensure project is open
        if project_account.state != ProjectState::Open as u8 {
            return Err(ErrorCode::ProjectNotOpen.into());
        }

        // Update the freelancer's name
        project_account.freelancer_name = freelancer_name;

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

    // Function to close a project
    pub fn close_project(ctx: Context<CloseProject>, _id: u64) -> Result<()> {
        let project_account = &mut ctx.accounts.project_account;
        project_account.state = ProjectState::Closed as u8; // Convert enum to u8
        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(id : u64)]
pub struct RegisterClient<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
            init,
            payer = authority,
            space = 8 + 8 + 32 + (4 + 12) + 8 + 1,  // Adjust space for your needs
            seeds = [b"project", authority.key().as_ref(),id.to_le_bytes().as_ref()], 
            bump
        )]
    pub client_account: Account<'info, ClientAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(id : u64)]
pub struct CreateProject<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
            init,
            payer = authority,
            space = 8 + 8 + 32 + (4 + 12) + 8 + 1,  // Adjust space for your needs
            seeds = [b"project", authority.key().as_ref(),id.to_le_bytes().as_ref()], 
            bump
        )]
    pub project_account: Account<'info, ProjectAccount>,

    #[account(mut)]
    pub client_account: Account<'info, ClientAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(id : u64)]
pub struct RegisterFreelancer<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
            init,
            payer = authority,
            space = 8 + 8 + 32 + (4 + 12) + 8 + 1,  // Adjust space for your needs
            seeds = [b"project", authority.key().as_ref(),id.to_le_bytes().as_ref()], 
            bump
        )]
    pub freelancer_account: Account<'info, FreelancerAccount>,

    pub system_program: Program<'info, System>,
}



#[derive(Accounts)]
#[instruction(id : u64)]
pub struct AssignProject<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // Client

    #[account(mut)]
    pub project_account: Account<'info, ProjectAccount>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction(id : u64)]
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

    pub system_program: Program<'info, System>,
}



#[derive(Accounts)]
#[instruction(id : u64)]
pub struct CloseProject<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        close = authority,
        seeds = [b"project", authority.key().as_ref(), id.to_le_bytes().as_ref()], 
        bump
    )]
    pub project_account: Account<'info, ProjectAccount>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct ClientAccount {
    pub id: u64,
    pub client_name: String,
}

#[account]
#[derive(Default)]
pub struct ProjectAccount {
    pub id: u64,
    pub client_name: String,
    pub description: String,
    pub budget: u64,
    pub state: u8,                 // Change to u8
    pub freelancer_name: String,   // Add freelancer_name field
    pub agreed_price: u64, // Add a field to store the agreed-upon price
}

#[account]
#[derive(Default)]
pub struct FreelancerAccount {
    pub id: u64,
    pub freelancer_name: String,
}

#[repr(u8)] // Represent the enum as u8 in the Solana account
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
