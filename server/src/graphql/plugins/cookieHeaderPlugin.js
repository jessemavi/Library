import cookie from 'cookie';

/*
An Apollo Server plugin can tap into an event requestDidStart for request-related events.
https://www.apollographql.com/docs/apollo-server/integrations/plugins/
*/
const cookieHeaderPlugin = {
  requestDidStart() {
    return {
      willSendResponse({ operation, response }) {
        if (operation?.operation === "mutation") {
          const authMutation = operation.selectionSet.selections.find(
            selection =>       
              selection.name.value === "login" ||
              selection.name.value === "logout" ||
              selection.name.value === "signUp"
          );

          if (!authMutation) return;

          const fieldName = authMutation.name.value;

          if (fieldName === "logout") {
            // invalidate the token cookie by creating a new cookie with an expiration date in the past
            const cookieString = cookie.serialize("token", "", {
                httpOnly: true,
                expires: new Date(1)
            });
            response.http.headers.set("Set-Cookie", cookieString);
          } else {
            if (response.data?.[fieldName].token) {
              const cookieString = cookie.serialize(
                "token",
                response.data[fieldName].token,
                { httpOnly: true, maxAge: 86400 }
              );
              response.http.headers.set("Set-Cookie", cookieString);
            }
          }
        }
      }
    }
  }
};

export default cookieHeaderPlugin;
