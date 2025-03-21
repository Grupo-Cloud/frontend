import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg text-gray-500">
        Oops! The page you are looking for does not exist.
      </p>
      <Button onClick={() => navigate("/")} variant="outline">
        Go to Home
      </Button>
    </div>
  );
};

export default NotFound;
