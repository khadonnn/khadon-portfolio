import React from "react";
import {
    Html,
    Body,
    Head,
    Heading,
    Hr,
    Container,
    Preview,
    Section,
    Text,
    Img,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type ContactFormEmailProps = {
    message: string;
    senderEmail: string;
};

export default function ContactFormEmail({
    message,
    senderEmail,
}: ContactFormEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>New message from your portfolio site</Preview>
            <Tailwind>
                <Body className='bg-gray-100 text-black'>
                    <Container>
                        <Section className='bg-white borderBlack my-10 px-10 py-4 rounded-md'>
                            <Img
                                src={`${process.env.NEXT_PUBLIC_DOMAIN_POR}/kd_logo.svg`}
                                alt='Logo'
                                width='100'
                                height='100'
                            />
                            <Heading className='leading-tight'>
                                You received the following message from the
                                contact form
                            </Heading>
                            <Text>{message}</Text>
                            <Hr />
                            <Text>The sender's email is: {senderEmail}</Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
