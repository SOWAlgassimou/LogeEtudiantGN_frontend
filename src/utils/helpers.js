export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'GNF'
  }).format(price);
};

export const formatDate = (date) => {
  if (!date) return 'Date non disponible';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Date invalide';
  }
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoYW1icmU8L3RleHQ+PC9zdmc+';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads/')) return `http://localhost:5000${imagePath}`;
  return `${import.meta.env.VITE_UPLOADS_URL}/${imagePath}`;
};

export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.error || 'Une erreur est survenue';
  }
  return 'Erreur de connexion';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getDateLabel = (dateString) => {
  if (!dateString) return '';
  
  try {
    const messageDate = new Date(dateString);
    if (isNaN(messageDate.getTime())) {
      return 'Date invalide';
    }
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();
    
    if (isToday) return 'Aujourd\'hui';
    if (isYesterday) return 'Hier';
    
    return messageDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.warn('Error getting date label:', error);
    return 'Date invalide';
  }
};

export const groupMessagesByDate = (messages) => {
  if (!messages || messages.length === 0) return [];
  
  try {
    const groups = [];
    let currentGroup = null;
    
    messages.forEach(message => {
      if (!message?.createdAt) return;
      
      const messageDate = new Date(message.createdAt);
      if (isNaN(messageDate.getTime())) return;
      
      const dateString = messageDate.toDateString();
      
      if (!currentGroup || currentGroup.date !== dateString) {
        currentGroup = {
          date: dateString,
          label: getDateLabel(message.createdAt),
          messages: []
        };
        groups.push(currentGroup);
      }
      
      currentGroup.messages.push(message);
    });
    
    return groups;
  } catch (error) {
    console.warn('Error grouping messages by date:', error);
    return [];
  }
};