
import { useState } from "react";
import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackForm = ({ isOpen, onClose }: FeedbackFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackCategories = [
    { id: "delivery", label: "Delivery Process", emoji: "🚚" },
    { id: "packaging", label: "Packaging Quality", emoji: "📦" },
    { id: "freshness", label: "Flower Freshness", emoji: "🌸" },
    { id: "service", label: "Customer Service", emoji: "👥" },
    { id: "app", label: "App Experience", emoji: "📱" },
    { id: "other", label: "Other", emoji: "💬" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !category || !comment.trim()) {
      toast({
        title: "Please fill all fields",
        description: "Rating, category, and comment are required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Feedback submitted:", { rating, category, comment, timestamp: new Date() });
    
    toast({
      title: "Thank you for your feedback! 🙏",
      description: "Your feedback helps us deliver better fresh flowers",
      variant: "default"
    });

    setRating(0);
    setCategory("");
    setComment("");
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t('feedbackTitle')}</h2>
            <p className="text-gray-600 text-sm">{t('feedbackDesc')}</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating *
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  } hover:text-yellow-400 transition-colors`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Category *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {feedbackCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    category === cat.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-lg">{cat.emoji}</div>
                  <div className="text-sm font-medium">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback *
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with our fresh flower delivery service..."
              className="min-h-[100px]"
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {comment.length}/500
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback 🌸"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
