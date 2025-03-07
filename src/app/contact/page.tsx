import React from "react";
import { Mail, Twitter, Linkedin, Github } from "lucide-react";

const Contact = () => {
    return (
        <div className="container mx-auto px-4 py-10 max-w-3xl text-center">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="mb-6">Have questions or want to get in touch? Reach out to us through the following channels:</p>

            <div className="flex justify-center space-x-6 text-2xl">
                <a href="mailto:TheDevJournal@protonmail.com" className="text-blue-500 hover:text-blue-700" aria-label="Email">
                    <Mail size={24} />
                </a>
                <a href="https://twitter.com/EVeldrine" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600" aria-label="Twitter">
                    <Twitter size={24} />
                </a>
                <a href="https://linkedin.com/in/veldrineevelia" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900" aria-label="LinkedIn">
                    <Linkedin size={24} />
                </a>
                <a href="https://github.com/Tech-Vexy" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600" aria-label="GitHub">
                    <Github size={24} />
                </a>
            </div>

            <p className="mt-6">We&#39;d love to hear from you!</p>
        </div>
    );
};

export default Contact;
