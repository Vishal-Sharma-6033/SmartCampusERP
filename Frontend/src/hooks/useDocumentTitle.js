import { useEffect } from 'react';

const useDocumentTitle = (title, description) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | SmartCampusERP`;
    } else {
      document.title = 'SmartCampusERP - College Management Portal';
    }

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);
};

export default useDocumentTitle;
