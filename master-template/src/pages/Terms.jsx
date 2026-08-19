import { siteConfig } from '../config/site'
import { useScrollTop } from '../hooks/useScroll'
import PageTransition from '../components/ui/PageTransition'
import LegalLayout from '../components/ui/LegalLayout'

/** Terms of service — rendered via the shared legal layout. */
export default function Terms() {
  useScrollTop()

  const sections = [
    {
      title: '1. Acceptance of terms',
      body: [
        `By accessing or purchasing from ${siteConfig.storeName}, you agree to these Terms of Service. If you do not agree, please do not use this website.`,
      ],
    },
    {
      title: '2. Products & pricing',
      body: [
        'All product descriptions, images and prices are provided for demonstration purposes and may be updated at any time without notice.',
        'We make every effort to display accurate colours and details, but your screen may render them slightly differently.',
      ],
    },
    {
      title: '3. Orders & payment',
      body: [
        'By placing an order you make an offer to purchase. We may accept or decline any order, and we reserve the right to cancel orders suspected of fraud or error.',
        'This is a demo store — checkout does not process real payments.',
      ],
    },
    {
      title: '4. Shipping & delivery',
      body: [
        `Delivery estimates are provided at checkout and are not guaranteed arrival dates. Risk of loss passes to you upon delivery. Orders over ₹${siteConfig.freeShippingThreshold} receive free standard shipping.`,
      ],
    },
    {
      title: '5. Returns & refunds',
      body: [
        'We offer a 30-day return window from the date of delivery. Items must be returned in their original condition and packaging for a full refund.',
      ],
    },
    {
      title: '6. Intellectual property',
      body: [
        `All content on this site — including product photography, text and branding — is the property of ${siteConfig.storeName} and may not be reproduced without written permission.`,
      ],
    },
    {
      title: '7. Limitation of liability',
      body: [
        'To the maximum extent permitted by law, the store shall not be liable for indirect, incidental or consequential damages arising from your use of this website.',
      ],
    },
    {
      title: '8. Contact',
      body: [`Questions about these terms? Reach us at ${siteConfig.contact.email}.`],
    },
  ]

  return (
    <PageTransition>
      <LegalLayout title="Terms of Service" updated="January 2026" sections={sections} />
    </PageTransition>
  )
}
