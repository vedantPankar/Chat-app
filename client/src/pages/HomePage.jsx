import { useContext } from "react";
import SideBar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid relative ${
          selectedUser
            ? "grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "grid-cols-[1fr_2fr]"
        }`}
      >
        <SideBar />
        <ChatContainer />

        {selectedUser && (
          <RightSidebar
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
