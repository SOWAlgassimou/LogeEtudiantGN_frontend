import { useState, useEffect } from 'react';
import { useConversations, useMessages, useSendMessage, useContactableUsers, useCreateConversation } from '../hooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BackButton from '../components/common/BackButton';
import { formatDate, groupMessagesByDate } from '../utils/helpers';
import { Send, MessageCircle, User, Plus } from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);

  const { data: conversations, isLoading: loadingConversations } = useConversations();
  

  const { data: contactableUsers, isLoading: loadingContactable } = useContactableUsers();
  const { data: messages, isLoading: loadingMessages } = useMessages(selectedConversation?._id);
  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();
  const queryClient = useQueryClient();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await sendMessage.mutateAsync({
        destinataire: selectedConversation.user._id,
        texte: newMessage.trim()
      });
      setNewMessage('');
      // Rafraîchir immédiatement les conversations
      queryClient.invalidateQueries(['conversations']);
      queryClient.invalidateQueries(['messages']);
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== user.id);
  };

  if (loadingConversations) return <LoadingSpinner size="lg" className="py-8" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Liste des conversations */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Conversations</h2>
                <button
                  onClick={() => setShowNewConversation(!showNewConversation)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  title="Nouvelle conversation"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto h-full">
                {showNewConversation && (
                  <div className="p-4 border-b border-gray-200 bg-blue-50">
                    <h3 className="text-sm font-medium mb-2">Commencer une conversation</h3>
                    {loadingContactable ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {contactableUsers?.map((contactUser) => (
                          <button
                            key={contactUser._id}
                            onClick={async () => {
                              try {
                                const newConv = await createConversation.mutateAsync(contactUser._id);
                                // Créer un objet conversation temporaire avec les infos de l'utilisateur
                                setSelectedConversation({
                                  _id: newConv.conversationId,
                                  user: contactUser
                                });
                                setShowNewConversation(false);
                              } catch (error) {
                                console.error('Erreur création conversation:', error);
                              }
                            }}
                            className="w-full text-left p-2 hover:bg-white rounded flex items-center"
                          >
                            <User className="h-4 w-4 mr-2" />
                            <span className="text-sm">{contactUser.nom}</span>
                            <span className="text-xs text-gray-500 ml-2">({contactUser.role})</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {(!conversations || conversations.length === 0) && !showNewConversation ? (
                  <div className="p-4 text-center text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucune conversation</p>
                    <p className="text-xs mt-1">Cliquez sur + pour démarrer</p>
                  </div>
                ) : (
                  conversations?.map((conversation, index) => {
                    return (
                      <div
                        key={conversation._id || conversation.user?._id || index}
                        onClick={() => {
                          setSelectedConversation(conversation);
                          // Rafraîchir immédiatement les conversations
                          queryClient.invalidateQueries(['conversations']);
                        }}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          selectedConversation?._id === conversation._id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {conversation.user?.nom || conversation.nom || 'Utilisateur'}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.lastMessage?.texte 
                                ? (conversation.lastMessage.texte.length > 30 
                                   ? conversation.lastMessage.texte.substring(0, 30) + '...' 
                                   : conversation.lastMessage.texte)
                                : 'Nouvelle conversation'
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-400">
                                {formatDate(conversation.lastMessage.createdAt)}
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mt-1">
                                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Zone de chat */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* En-tête du chat */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">
                        {selectedConversation.user?.nom || selectedConversation.nom || 'Utilisateur'}
                      </h3>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {loadingMessages ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      groupMessagesByDate(messages || []).map((group, groupIndex) => (
                        <div key={groupIndex} className="mb-6">
                          {/* Séparateur de date */}
                          <div className="flex justify-center mb-4">
                            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                              {group.label}
                            </div>
                          </div>
                          
                          {/* Messages du groupe */}
                          <div className="space-y-4">
                            {group.messages.map((message) => (
                              <div
                                key={message._id}
                                className={`flex ${message.expediteur._id === user.id ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    message.expediteur._id === user.id
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-200 text-gray-900'
                                  }`}
                                >
                                  <p>{message.texte}</p>
                                  <p className={`text-xs mt-1 ${
                                    message.expediteur._id === user.id ? 'text-blue-100' : 'text-gray-500'
                                  }`}>
                                    {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Zone de saisie */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                        className="flex-1 input-field"
                        disabled={sendMessage.isLoading}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sendMessage.isLoading}
                        className="btn-primary px-4 py-2 flex items-center"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Sélectionnez une conversation pour commencer</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;