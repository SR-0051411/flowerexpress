
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnquiry } from "@/contexts/EnquiryContext";

const EnquiryButton = () => {
  const { setIsEnquiryOpen } = useEnquiry();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => setIsEnquiryOpen(true)}
        className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        size="lg"
      >
        <MessageCircle className="w-6 h-6 mr-2" />
        <span className="font-semibold">
          விசாரணை <span className="text-xs opacity-90">Enquiry</span>
        </span>
      </Button>
    </div>
  );
};

export default EnquiryButton;
