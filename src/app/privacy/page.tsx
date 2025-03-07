import React from "react";
import Link from "next/link";

const PrivacyPolicy = () => {
    return (
        <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
    <p className="mb-4">Effective Date: March 2025</p>

    <p className="mb-4">
        Welcome to <strong>The Dev Journal</strong>. Your privacy is important to us. This Privacy Policy
    explains how we collect, use, and protect your information when you use our blog.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
    <p className="mb-4">
        When you visit The Dev Journal, we may collect the following types of information:
        </p>
        <ul className="list-disc pl-6 mb-4">
        <li>Personal information (e.g., name, email) when you subscribe to our newsletter or comment on posts.</li>
    <li>Usage data such as IP address, browser type, and pages visited.</li>
    <li>Cookies to enhance your browsing experience.</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
    <p className="mb-4">
        The information we collect is used to:
        </p>
        <ul className="list-disc pl-6 mb-4">
        <li>Provide and improve our content and services.</li>
    <li>Send newsletters and updates if you subscribe.</li>
    <li>Analyze site traffic to optimize user experience.</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-2">3. Third-Party Services</h2>
    <p className="mb-4">
        We may use third-party services, such as Google Analytics and Brevo (for newsletters), which have their own
    privacy policies. These services help us analyze user engagement and manage email subscriptions.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">4. Data Protection</h2>
    <p className="mb-4">
        We implement security measures to protect your personal data. However, no method of transmission over the
    internet is 100% secure.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">5. Your Rights</h2>
    <p className="mb-4">
        You have the right to access, update, or delete your personal information. Contact us if you wish to exercise
    these rights.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">6. Changes to This Policy</h2>
    <p className="mb-4">
        We may update this Privacy Policy from time to time. Any changes will be posted on this page.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">7. Contact Us</h2>
    <p className="mb-4">
        If you have any questions about this Privacy Policy, you can contact us at: <Link  href="mailto:TheDevJournal@protonmail.com" className={"text-blue-900"}>TheDevJournal@protonmail.com.</Link>
    </p>
    </div>
);
};

export default PrivacyPolicy;
