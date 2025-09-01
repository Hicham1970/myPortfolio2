'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { ContactFormSchema, NewsletterFormSchema } from '@/lib/schemas'
import ContactFormEmail from '@/emails/contact-form-email'
import WelcomeEmail from '@/emails/welcome-email'

type ContactFormInputs = z.infer<typeof ContactFormSchema>
type NewsletterFormInputs = z.infer<typeof NewsletterFormSchema>
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data)

  if (result.error) {
    return { error: result.error.format() }
  }

  try {
    const { name, email, message } = result.data
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      cc: ['h.garoum@gmail.com'],
      subject: 'Contact form submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      react: ContactFormEmail({ name, email, message })
    })

    if (!data || error) {
      throw new Error('Failed to send email')
    }

    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function subscribe(data: NewsletterFormInputs) {
  const result = NewsletterFormSchema.safeParse(data)

  if (result.error) {
    return { error: result.error.format() }
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!audienceId) {
    console.error('RESEND_AUDIENCE_ID is not defined in environment variables.')
    // Retourner une erreur générique à l'utilisateur pour la sécurité
    return { error: 'An internal server error occurred.' }
  }

  try {
    const { email } = result.data
    const { data: contactData, error: contactError } = await resend.contacts.create({
      email: email,
      audienceId: audienceId
    })

    // Gérer le cas où le contact existe déjà
    if (contactError?.name === 'validation_error') {
      return { error: 'This email is already subscribed.' }
    }

    // Si une autre erreur se produit, l'afficher dans la console pour le débogage
    if (!contactData || contactError) {
      console.error('Resend contact creation failed:', contactError)
      throw new Error('Failed to add contact to the audience.')
    }

    // TODO: Send a welcome email
    // L'e-mail de bienvenue est envoyé ici
    await resend.emails.send({
      from: 'onboarding@resend.dev', // IMPORTANT: Remplacez par votre domaine vérifié en production
      to: [email],
      subject: 'Bienvenue dans notre Newsletter !',
      react: WelcomeEmail({ email })
    })

    return { success: true }
  } catch (error) {
    console.error('Subscription process failed:', error)
    return { error: 'An unexpected error occurred. Please try again later.' }
  }
}
