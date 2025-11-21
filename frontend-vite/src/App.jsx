import { useState } from "react";
import AuthPage from "./components/AuthPage";
import SolsexPlatform from "./components/SolsexPlatform";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) {
    return <AuthPage onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <SolsexPlatform
      currentUser={currentUser}
      onLogout={() => setCurrentUser(null)}
    />
  );
}

export default App;
