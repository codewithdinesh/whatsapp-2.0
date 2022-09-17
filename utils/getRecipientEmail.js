

const getRecipientEmail = (users, userLoggedIn) => {

    // filter the emails
    // hide own email
    return users?.filter(userToFilter => userToFilter !== userLoggedIn?.email)[0];

}
export default getRecipientEmail;
