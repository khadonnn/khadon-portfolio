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

type ThankFormEmailProps = {
    message?: string;
    senderName: string;
};

export default function ThankYouEmail({ senderName }: ThankFormEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>New message from your portfolio site</Preview>
            <Tailwind>
                <Body className='bg-gray-100 text-black'>
                    <Container className='flex justify-center items-center min-h-screen'>
                        <Section className='bg-white borderBlack my-10 px-10 py-4 rounded-md'>
                            <Img
                                src={`${process.env.NEXT_PUBLIC_DOMAIN_POR}/public/kd_logo.svg`}
                                alt='Logo'
                                width='100'
                                height='100'
                            />
                            <Heading className='leading-tight'>
                                Thank you for your contact!
                            </Heading>

                            <Hr />
                            <Text>
                                We will get back to you soon: {senderName}
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
