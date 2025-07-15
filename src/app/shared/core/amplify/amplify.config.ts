/* import { Constants } from "@shared_models/constants.model";
import { environment } from '../../../../environments/environment';
import { AmplifyHelper } from "@shared_utils/amplify.utils";
import sweetalert from "sweetalert2";
import { redirectToLogin } from "@shared_utils/types-convertion.utils";

let custom_header = async () => {
    let jwtToken = null;
    try {
        // jwtToken = await AmplifyHelper.getJwtToken();
        jwtToken = 'eyJraWQiOiI4emlOVWordzZLd0ZUYzZzZWxMdEtuQTFHU0FiUXFsaWNRdHZYd1ZkS2dVPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzMzYxZGU2OS0yZjlmLTQ2NzMtYWVlYS02NzA3YzM0MTAwMjciLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xX2M1Njc1OTk0LTEwYmYtNGYxNC1iYzYzLWY3NWVjZDJlMTAzZiIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX3ROT1BWOHpQciIsImNsaWVudF9pZCI6IjQzaTVtMTdyNTcxZ3VqajJzOHNyNnRuNzBlIiwib3JpZ2luX2p0aSI6IjJlYzNlYWY1LTJjNWUtNDMwZC1hZDY1LTgwN2EyZTk5YjRkMSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NTIwNzc0MDAsImV4cCI6MTc1MjA3NzcwMCwiaWF0IjoxNzUyMDc3NDAwLCJqdGkiOiI3OTQxZjhjZS02YzI2LTRlZDktYWY4YS0wNGFhNTk4MGZhOGEiLCJ1c2VybmFtZSI6IjMzNjFkZTY5LTJmOWYtNDY3My1hZWVhLTY3MDdjMzQxMDAyNyJ9.VV75ZuezWrzRmwbC5w4PDd0xn3MG5aAxkrjoJkca1GI2QrF-6PNjNIp-1tLFlikl2WB5uTglbm9XMyDhOt7Gke8FaOkhkQ1vS5DIj8S7RObEHBeLGmOufVoUXmdXid7HuQyTAmGtqNYi7vcJlpJRlKFIMDBkI2kf5YxEUb6EYzezsiOA1_SlcjxT49pz9whSEN9Y_759x-g1PVQk-PaME32Lq3YfXeskCjfgW77swPtQV4_6V5G92uFMpVh-2EXoZbf3yE7r1GltnOcObWCYouQgKDXwteOZl-S7LczqgYMNpo35zUuzXAPfmyACNgHvdphyelUKwP75IFE1NuldeQ';
    } catch (error) {
        console.log("errorrr", error)
        await sweetalert.fire({
            title: "¡Error! :(",
            html: "Sesión Terminada",
            icon: "error",
            confirmButtonText: 'Ok'
        });
        redirectToLogin();
    }
    return {
        Authorization: jwtToken
    };
}

let endpoints = [];

if (!environment.production) {
    endpoints.push({
        name: Constants.API_NAME_LOCALHOST,
        endpoint: 'http://localhost:3000',
        custom_header
    });
}

export const config = {
    Auth: {
        region: 'us-east-1',
        userPoolId: environment.userPoolId, // 'us-east-1_pRuCHvkeb',
        identityPoolId: environment.identityPoolId, // 'us-east-1:f0e3f833-f89f-45df-87e9-6744563a1f3f',
        userPoolWebClientId: environment.userPoolWebClientId, // '324m0ktuh3j6eceb8k0l0j7p3g',
        oauth: {
            domain: environment.domainCognito + '.auth.us-east-1.amazoncognito.com',
            scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
            redirectSignIn: environment.urlFront + '/',
            redirectSignOut: environment.urlFront + '/',
            responseType: 'code',
        },
    },
    API: {
        endpoints
    },
    Storage: {
        AWSS3: {
            bucket: environment.bucket,
            region: environment.region
        }
    }
}; */