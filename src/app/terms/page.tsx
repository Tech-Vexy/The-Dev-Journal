import React from "react";
import Link from "next/link";

const TermsOfService = () => {
    return (
        <div className="container mx-auto px-4 py-10 max-w-3xl">
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="mb-4">Effective Date: March 2025</p>

            <p className="mb-4">
                Welcome to <strong>The Dev Journal</strong>. By accessing and using our blog, you agree to comply with the following terms and conditions.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">1. Use of Content</h2>
            <p className="mb-4">
                All content on The Dev Journal is for informational purposes only. You may not copy, distribute, or modify content without permission.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">2. User Responsibilities</h2>
            <p className="mb-4">
                When using The Dev Journal, you agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4">
                <li>Violate any applicable laws or regulations.</li>
                <li>Post offensive or harmful content in comments.</li>
                <li>Attempt to gain unauthorized access to our systems.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-2">3. Third-Party Links</h2>
            <p className="mb-4">
                Our blog may contain links to third-party websites. We are not responsible for the content or policies of these external sites.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">4. Disclaimer</h2>
            <p className="mb-4">
                The content on The Dev Journal is provided &#34;as is&#34; without warranties of any kind. We do not guarantee the accuracy or completeness of information shared.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
            <p className="mb-4">
                We are not liable for any damages resulting from the use of our blog, including direct, indirect, or consequential damages.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">6. Changes to These Terms</h2>
            <p className="mb-4">
                We reserve the right to update these terms at any time. Changes will be posted on this page.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">7. Contact Us</h2>
            <p className="mb-4">
                If you have any questions about these Terms of Service, contact us at: <Link  href="mailto:TheDevJournal@protonmail.com" className={"text-blue-900"}>TheDevJournal@protonmail.com.</Link>
            </p>
        </div>
    );
};

export default TermsOfService;
