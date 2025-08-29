import Messages from "../../components/Messages/Messages";
import Chat from "../../components/Chat/Chat";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { messagesApi } from "../../api/messagesApi";

const MessagesPage = () => {
  const { conversationId } = useParams();

  const {
    data: conversations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => messagesApi.getConversations(),
  });

  if (conversationId) {
    const conversation = conversations?.conversations?.find(
      (conv) => conv._id === conversationId
    );
    return <Chat conversationId={conversationId} conversation={conversation} />;
  }

  return (
    <Messages
      conversations={conversations}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default MessagesPage;
