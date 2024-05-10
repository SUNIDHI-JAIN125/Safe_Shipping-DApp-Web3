use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::Sysvar;
use std::str::FromStr;
use std::mem::size_of;

declare_id!("Ab8n8gyf9YT4gMwW84HaoAsJwJisbsHa5Z9L7AVxpC4y");


#[program]
pub mod safe_shipping { 

    use super::*;
  
    // Function to register a client
    // pub fn register_client(
    //     ctx: Context<RegisterClient>,
    //     id: u64,
    //     client_name: String,
    // ) -> Result<()> {
    //     let client_account = &mut ctx.accounts.client_account;
    //     client_account.id = id;
    //     client_account.client_name = client_name.clone(); 
    //     msg!(
    //         "client name and id are {:?} {:?}",
    //         client_account.client_name,
    //         client_account.id
    //     );
    //     Ok(())
    // }


// Function to create a project
    pub fn create_project(
    ctx: Context<CreateProject>,
    id: u64,
    client_name:String,
    description: String,
    budget: u64,
) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;
    project_account.id = id;
    project_account.client_name = client_name.clone();
    project_account.description = description;
    project_account.budget = budget.clone();
    project_account.state = ProjectState::Open as u8;
    project_account.authority = *ctx.accounts.authority.key;
    // project_account.freelancer_pubkey="".to_string().clone();
    project_account.agreed_price = budget.clone();
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
        freelancer_account.freelancer_name = freelancer_name.clone(); // Use the function parameter
        msg!(
            "freelancer name and id are {:?} {:?}",
            freelancer_account.freelancer_name,
            freelancer_account.id
        );
        Ok(())
    }


   // Function to assign a project to a freelancer
    pub fn assign_project(
    ctx: Context<AssignProject>,
    _id: u64,
    freelancer_pubkey_str: String,
    agreed_price: u64,
) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;

    // Ensure the caller is the owner of the project account
    if ctx.accounts.authority.key != &project_account.authority {
        return Err(ErrorCode::Unauthorized.into());
    }

    // Ensure project is open
    if project_account.state != ProjectState::Open as u8 {
        return Err(ErrorCode::ProjectNotOpen.into());
    }

    let freelancer_pubkey = Pubkey::from_str(&freelancer_pubkey_str)
        .map_err(|_| ErrorCode::InvalidFreelancer)?;

    // Assign project to the freelancer
    project_account.freelancer_pubkey = freelancer_pubkey;
    project_account.agreed_price = agreed_price;
    project_account.state = ProjectState::InProgress as u8;

    Ok(())
}



// Function to mark project as completed
    pub fn complete_project(ctx: Context<CompleteProject>, _id: u64) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;

    // Ensure project is in progress
    if project_account.state != ProjectState::InProgress as u8 {
        return Err(ErrorCode::ProjectNotOpen.into());
    }
    // Close the project
    project_account.state = ProjectState::Closed as u8;

    Ok(())
}


    // Function to close a project
    pub fn close_project(ctx: Context<CloseProject>, _id: u64) -> Result<()> {
        let project_account = &mut ctx.accounts.project_account;
        project_account.state = ProjectState::Closed as u8; 
        Ok(())
    }

}


// #[derive(Accounts)]
// #[instruction(id : u64)]
// pub struct RegisterClient<'info> {
//     #[account(mut)]
//     pub authority: Signer<'info>,

//     #[account(
//             init,
//             payer = authority,
//             space = 8 + 8 + 32 + (4 + 12) + 8 + 1,  
//             seeds = [b"project", authority.key().as_ref(),id.to_le_bytes().as_ref()], 
//             bump
//         )]
//     pub client_account: Account<'info, ClientAccount>,

//     pub system_program: Program<'info, System>,
// }

#[derive(Accounts)]
#[instruction(id : u64)]
pub struct CreateProject<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
            init,
            payer = authority,
            space = 8 + size_of::<ProjectAccount>() + 8 + 1,   
            seeds = [b"project", authority.key().as_ref(),id.to_le_bytes().as_ref()], 
            bump
        )]
    pub project_account: Account<'info, ProjectAccount>,
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
            space = 8 + 8 + 32 + (4 + 12) + 8 + 1, 
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
    pub authority: Signer<'info>,

    #[account(mut)]
    pub project_account: Account<'info, ProjectAccount>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction(id : u64)]
pub struct CompleteProject<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, 

    #[account(mut)]
    pub project_account: Account<'info, ProjectAccount>,

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

// #[account]
// #[derive(Default)]
// pub struct ClientAccount {
//     pub id: u64,
//     pub client_name: String,
// }

#[account]
#[derive(Default)]
pub struct ProjectAccount {
    pub id: u64,
    pub client_name: String,
    pub description: String,     
    pub budget: u64,
    pub state: u8,            
    pub freelancer_pubkey: Pubkey,   
    pub agreed_price: u64,
    pub authority: Pubkey,
} 

#[account]
#[derive(Default)]
pub struct FreelancerAccount {
    pub id: u64,
    pub freelancer_name: String,
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
    Unauthorized
}

impl From<ErrorCode> for anchor_lang::error::Error {
    fn from(error: ErrorCode) -> Self {
        match error {
            ErrorCode::ProjectNotOpen => anchor_lang::error::Error::from(ProgramError::Custom(0)),
            ErrorCode::InvalidFreelancer => {
                anchor_lang::error::Error::from(ProgramError::Custom(1))
            }   
            ErrorCode::Unauthorized => {
                anchor_lang::error::Error::from(ProgramError::Custom(2))
            }
        }
    }
}