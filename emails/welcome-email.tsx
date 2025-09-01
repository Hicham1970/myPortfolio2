import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text
} from '@react-email/components'
import * as React from 'react'

interface WelcomeEmailProps {
  email: string
}

export const WelcomeEmail = ({ email }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bienvenue dans notre newsletter !</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Merci pour votre inscription !</Heading>
        <Text style={paragraph}>Bonjour,</Text>
        <Text style={paragraph}>
          Nous sommes ravis de vous compter parmi nous. Vous recevrez bientôt nos
          dernières actualités et mises à jour directement dans votre boîte de
          réception ({email}).
        </Text>
        <Text style={paragraph}>
          À très bientôt,
          <br />
          L&apos équipe
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

// --- Styles ---
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px'
}

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px'
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px'
}