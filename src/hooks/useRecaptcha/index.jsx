import { useEffect, useState } from 'react';
import { recaptchaKey } from 'src/services/settings';

export default function useRecaptcha() {
  const [reCaptchaLoaded, setReCaptchaLoaded] = useState(false);

  useEffect(() => {
    // Add reCaptcha
    if (typeof window === 'undefined') return;
    if (typeof window.grecaptcha !== 'undefined') {
      setReCaptchaLoaded(true);
    } else {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setReCaptchaLoaded(true);
      document.body.appendChild(script);
    }
  }, []);

  return reCaptchaLoaded;
}
