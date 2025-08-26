import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function MessagesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { conversations, messages, sendMessage, markAsRead, createConversation } = useChat();
  const { user } = useAuth();
  const { toast } = useToast();

  // Auto create conversation if coming from product page
  useEffect(() => {
    if (location.state?.sellerId && user) {
      const conversationId = createConversation(
        user.id,
        user.name,
        location.state.sellerId,
        location.state.sellerName
      );
      setSelectedConversation(conversationId);
      
      if (location.state.productName) {
        setTimeout(() => {
          sendMessage(
            location.state.sellerId,
            location.state.sellerName,
            `Olá! Tenho interesse no produto "${location.state.productName}". Poderia me dar mais informações?`
          );
        }, 500);
      }
    }
  }, [location.state, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso restrito</h1>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para acessar suas mensagens.
          </p>
          <Button onClick={() => navigate('/login')}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    const receiverId = conversation.participants.find(p => p !== user.id);
    const receiverName = conversation.participantNames[receiverId!];

    sendMessage(receiverId!, receiverName, newMessage);
    setNewMessage('');
    
    toast({
      title: "Mensagem enviada!",
      description: "Sua mensagem foi enviada com sucesso.",
    });
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="lg:hidden"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">
              Suas <span className="gradient-text">Mensagens</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="glass border-border/50 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Conversas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {conversations.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <p>Nenhuma conversa ainda</p>
                      <p className="text-sm mt-2">
                        Entre em contato com vendedores para iniciar uma conversa
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {conversations.map((conversation) => {
                        const otherUserId = conversation.participants.find(p => p !== user.id);
                        const otherUserName = conversation.participantNames[otherUserId!];
                        const isSelected = selectedConversation === conversation.id;

                        return (
                          <div
                            key={conversation.id}
                            onClick={() => {
                              setSelectedConversation(conversation.id);
                              markAsRead(conversation.id);
                            }}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              isSelected ? 'bg-primary/20' : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{otherUserName[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate">{otherUserName}</p>
                                  {conversation.unreadCount > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      {conversation.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                                {conversation.lastMessage && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {conversation.lastMessage.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="glass border-border/50 lg:col-span-2">
              {selectedConversationData ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {selectedConversationData.participantNames[
                              selectedConversationData.participants.find(p => p !== user.id)!
                            ][0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {selectedConversationData.participantNames[
                              selectedConversationData.participants.find(p => p !== user.id)!
                            ]}
                          </h3>
                          <p className="text-sm text-muted-foreground">Online agora</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px] p-4">
                      <div className="space-y-4">
                        {conversationMessages.map((message) => {
                          const isOwn = message.senderId === user.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <p className={`text-xs mt-1 ${
                                  isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}>
                                  {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="border-t border-border/50 p-4">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Digite sua mensagem..."
                          className="flex-1 min-h-[60px] resize-none glass border-border/50"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                        />
                        <Button 
                          type="submit" 
                          className="btn-hero self-end"
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p className="text-lg mb-2">Selecione uma conversa</p>
                    <p className="text-sm">
                      Escolha uma conversa da lista para começar a chat
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}