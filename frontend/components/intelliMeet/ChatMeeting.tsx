import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const handleSendMessage = () => {
    console.log('Message sent')
}

const ChatMeeting = () => {
    return (
        <div className="flexCenter">
            <Input type="text" placeholder="Type a message" />
            <Button onClick={handleSendMessage}>Send</Button>
        </div>
    )
}

export default ChatMeeting
