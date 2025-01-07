// "use server";

// import React from "react";
// import { Resend } from "resend";
// import { validateString, getErrorMessage } from "@/lib/utils";
// import ContactFormEmail from "@/email/contact-form-email";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendEmail = async (formData: FormData) => {
//     const senderEmail = formData.get("senderEmail");
//     const message = formData.get("message");

//     // simple server-side validation
//     if (!validateString(senderEmail, 500)) {
//         return {
//             error: "Invalid sender email",
//         };
//     }
//     if (!validateString(message, 5000)) {
//         return {
//             error: "Invalid message",
//         };
//     }

//     let data;
//     try {
//         data = await resend.emails.send({
//             from: "Contact Portfolio <onboarding@resend.dev>",
//             to: "nguyendinhdongkha@gmail.com",
//             subject: "Message from contact form KD-Portfolio",
//             reply_to: senderEmail,
//             react: React.createElement(ContactFormEmail, {
//                 message: message,
//                 senderEmail: senderEmail,
//             }),
//         });
//
//         return {
//             success: true,
//             data,
//         };
//     } catch (error: unknown) {
//         return {
//             error: getErrorMessage(error),
//         };
//     }

//     return {
//         data,
//     };
// };
"use server";

import React from "react";
import { Resend } from "resend";
import { validateString, getErrorMessage } from "@/lib/utils";
import ContactFormEmail from "@/email/contact-form-email";
import ThankYouEmail from "@/email/thank-you-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
    const senderEmail = formData.get("senderEmail")?.toString();

    const message = formData.get("message")?.toString();

    // Validate inputs
    if (!validateString(senderEmail, 500)) {
        return {
            success: false,
            error: "Invalid sender email",
        };
    }
    if (!validateString(message, 5000)) {
        return {
            success: false,
            error: "Invalid message",
        };
    }

    try {
        // Send email to admin
        const adminResponse = await resend.emails.send({
            from: "Contact Portfolio <onboarding@resend.dev>",
            to: "nguyendinhdongkha@gmail.com",
            subject: "Message from contact form KD-Portfolio",
            reply_to: senderEmail,
            react: React.createElement(ContactFormEmail, {
                message: message,
                senderEmail: senderEmail,
            }),
        });

        return { success: true, data: { adminResponse } };
    } catch (error: unknown) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};
