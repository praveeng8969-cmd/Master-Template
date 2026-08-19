import { siteConfig } from '../config/site'
import { useScrollTop } from '../hooks/useScroll'
import PageTransition from '../components/ui/PageTransition'
import LegalLayout from '../components/ui/LegalLayout'

/** Privacy policy — rendered via the shared legal layout. */
export default function Privacy() {
  useScrollTop()

  const sections = [
    {
      title: '1. Information we collect',
      body: [
        'We collect information you provide directly — such as your name, email address, shipping address and payment details when you place an order or create an account.',
        'We also automatically collect certain information about your device and usage, including browser type, IP address and pages visited, to improve the shopping experience.',
      ],
    },
    {
      title: '2. How we use your information',
      body: [
        'We use your information to process orders, deliver products, provide customer support and send transactional updates such as shipping confirmations.',
        'With your consent, we may send marketing emails about new products, sales and exclusive offers. You can unsubscribe at any time with one click.',
      ],
    },
    {
      title: '3. Cookies & tracking',
      body: [
        'We use cookies and similar technologies to keep you signed in, remember your cart and understand how visitors use the store.',
        'This demo store uses only functional cookies. No advertising trackers are included in this template.',
      ],
    },
    {
      title: '4. Data sharing',
      body: [
        'We never sell your personal information. We share data only with service providers who help us run the store — such as payment processors and shipping carriers — and only to the extent necessary to serve you.',
      ],
    },
    {
      title: '5. Security',
      body: [
        'We take reasonable technical and organisational measures to protect your data, including SSL encryption on all checkout pages.',
        'This is a demo template — no real payments or personal data are processed or stored.',
      ],
    },
    {
      title: '6. Your rights',
      body: [
        'You may request access to, correction of, or deletion of your personal data at any time by contacting us. We respond to all requests within 30 days.',
      ],
    },
    {
      title: '7. Contact',
      body: [`For any privacy-related questions, email us at ${siteConfig.contact.email} or write to ${siteConfig.contact.address}.`],
    },
  ]

  return (
    <PageTransition>
      <LegalLayout title="Privacy Policy" updated="January 2026" sections={sections} />
    </PageTransition>
  )
}
