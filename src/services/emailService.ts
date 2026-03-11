import { toast } from "@/hooks/use-toast";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData) => {
  try {
    // Method 1: Use Formspree (free service that works from frontend)
    // You would need to sign up at formspree.io and get a form ID
    
    const formspreeEndpoint = 'https://formspree.io/f/your-form-id'; // Replace with actual form ID
    
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        _subject: `New Contact Form Message from ${formData.name}`,
        _replyto: formData.email,
      }),
    });

    if (response.ok) {
      toast({
        title: "Message Sent Successfully!",
        description: "Your message has been sent to sejalkumavat34@gmail.com",
      });
      return { success: true };
    } else {
      throw new Error('Formspree submission failed');
    }
  } catch (error) {
    console.error('Error with Formspree, trying mailto:', error);
    
    // Fallback: Use mailto link
    try {
      const emailContent = {
        to: 'sejalkumavat34@gmail.com',
        subject: `New Contact Form Message from ${formData.name}`,
        body: `
You have received a new message from the BG Remover contact form:

Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}

---
Sent on: ${new Date().toLocaleString()}
From: BG Remover Website
        `.trim()
      };

      const mailtoLink = `mailto:sejalkumavat34@gmail.com?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.body)}`;
      
      // Open in new window instead of redirecting
      window.open(mailtoLink, '_blank');
      
      toast({
        title: "Email Client Opened",
        description: "Please send the email from your email client to complete the submission.",
      });

      return { success: true };
    } catch (mailtoError) {
      console.error('Error with mailto:', mailtoError);
      
      // Final fallback: Copy to clipboard
      try {
        const emailText = `
To: sejalkumavat34@gmail.com
Subject: New Contact Form Message from ${formData.name}

Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
        `.trim();

        await navigator.clipboard.writeText(emailText);
        
        toast({
          title: "Message Copied",
          description: "Message copied to clipboard. Please paste and send to sejalkumavat34@gmail.com",
        });

        return { success: true };
      } catch (clipboardError) {
        console.error('Error with clipboard:', clipboardError);
        
        toast({
          title: "All Methods Failed",
          description: "Please manually email sejalkumavat34@gmail.com with your message.",
          variant: "destructive",
        });
        
        return { success: false };
      }
    }
  }
};

// Alternative: Use a backend API endpoint
export const sendEmailViaAPI = async (formData: ContactFormData) => {
  try {
    // This would require a backend service
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'sejalkumavat34@gmail.com',
        from: formData.email,
        subject: `New Contact Form Message from ${formData.name}`,
        text: `
          Name: ${formData.name}
          Email: ${formData.email}
          Message: ${formData.message}
        `,
      }),
    });

    if (response.ok) {
      toast({
        title: "Message Sent Successfully!",
        description: "Your message has been sent to sejalkumavat34@gmail.com",
      });
      return { success: true };
    } else {
      throw new Error('API request failed');
    }
  } catch (error) {
    console.error('Error sending email via API:', error);
    toast({
      title: "Sending Failed",
      description: "Failed to send message. Please try again later.",
      variant: "destructive",
    });
    return { success: false };
  }
};
