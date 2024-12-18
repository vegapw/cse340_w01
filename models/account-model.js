const pool = require('../database/')

/* ***************************
 *  Get all classification data
 * ************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Check Existing Mail
 * ************************** */
async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM public.account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const result = await pool.query(sql, [account_email])
      return result.rows[0]
    } catch (error) {
      return new Error("No matching email found")
    }
  }

/* ***************************
 *  Check Existing Mail different Id
 * ************************** */
async function checkExistingEmailDifferentId(account_email, account_id) {
    try {
        const sql = "SELECT * FROM public.account WHERE account_email = $1 AND account_id <> $2"
        const email = await pool.query(sql, [account_email, account_id])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Update account info
 * ************************** */
async function updateAccountInfo(account_firstname, account_lastname, account_email, account_id) {
    try {
        const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
        return data.rows[0]
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Update account password
 * ************************** */
async function updateAccountPass( account_id, account_password) {
    try {
        const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        const data = await pool.query(sql, [account_password, account_id])
        return data.rows[0]
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Get account by Id
 * ************************** */
async function getAccountById(account_id) {
    try {
        const sql = "SELECT * FROM public.account WHERE account_id = $1"
        const accountData = await pool.query(sql, [account_id])
        return accountData.rows[0]
    } catch (error) {
        return error.message
    }
}


module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, checkExistingEmailDifferentId, updateAccountInfo, updateAccountPass, getAccountById}