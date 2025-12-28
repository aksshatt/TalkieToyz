import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    const propertyId = import.meta.env.VITE_TAWK_TO_PROPERTY_ID;
    const widgetId = import.meta.env.VITE_TAWK_TO_WIDGET_ID;

    if (!propertyId || !widgetId) {
      console.warn('Tawk.to credentials not configured');
      return;
    }

    // Load Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default TawkToChat;
