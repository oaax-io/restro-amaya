import React from 'react'
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  title?: string
  eventDate?: string
  persons?: number
  amount?: string
  guarantee?: boolean
  ticketUrl?: string
}

const EventTicketEmail = ({ name, title, eventDate, persons, amount, guarantee, ticketUrl }: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Dein Ticket für {title || 'dein Event'} im Amaya</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>RESTAURANT AMAYA</Text>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Buchung bestätigt</Heading>
          <Text style={text}>{name ? `Hallo ${name},` : 'Hallo,'}</Text>
          <Text style={text}>vielen Dank für deine Anmeldung. Wir freuen uns auf dich!</Text>
          <Section style={box}>
            <Text style={label}>Event</Text>
            <Text style={value}>{title || 'Event'}</Text>
            {eventDate ? (<><Text style={label}>Datum</Text><Text style={value}>{eventDate}</Text></>) : null}
            <Text style={label}>Personen</Text>
            <Text style={value}>{persons ?? 1}</Text>
            {amount ? (<><Text style={label}>{guarantee ? 'Betrag (Karte hinterlegt, nicht abgebucht)' : 'Bezahlt'}</Text><Text style={value}>CHF {amount}</Text></>) : null}
          </Section>
          {ticketUrl ? (
            <>
              <Text style={text}>Zeige deinen QR-Code am Eingang vor:</Text>
              <Button href={ticketUrl} style={button}>QR-Ticket öffnen</Button>
            </>
          ) : null}
          <Hr style={hr} />
          <Text style={small}>Restaurant Amaya · Rothenburg LU · www.amaya-restaurant.ch</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: EventTicketEmail,
  subject: (d: Record<string, any>) => `Dein Ticket: ${d.title || 'Event im Amaya'}`,
  displayName: 'Event-Ticket',
  previewData: { name: 'Anna', title: 'Afro House Night', eventDate: '14. November 2026, 20:00', persons: 2, amount: '90.00', guarantee: false, ticketUrl: 'https://www.amaya-restaurant.ch/event-booking' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif' }
const container = { maxWidth: '560px', margin: '0 auto' }
const header = { backgroundColor: '#0d2517', padding: '24px', textAlign: 'center' as const }
const brand = { color: '#E9A580', fontSize: '18px', letterSpacing: '4px', margin: 0 }
const content = { padding: '28px 24px' }
const h1 = { color: '#0d2517', fontSize: '24px', margin: '0 0 16px' }
const text = { color: '#333333', fontSize: '15px', lineHeight: '1.6' }
const box = { border: '1px solid #E9A580', borderRadius: '6px', padding: '12px 18px', margin: '16px 0' }
const label = { color: '#8a6a4f', fontSize: '12px', textTransform: 'uppercase' as const, margin: '8px 0 0' }
const value = { color: '#0d2517', fontSize: '16px', margin: '2px 0 4px' }
const button = { backgroundColor: '#0d2517', color: '#E9A580', padding: '12px 24px', borderRadius: '4px', fontSize: '15px', textDecoration: 'none' }
const hr = { borderColor: '#eeeeee', margin: '28px 0 12px' }
const small = { color: '#999999', fontSize: '12px' }
