import "./App.css";
import TodoDate from "./components/TodoDate";
import ItemList from "./components/ItemList";
import { AppStateProvider } from "./AppContext"; // Ubah dari AppProvider ke AppStateProvider

function App() {
  return (
    <AppStateProvider>
      <div className="App">
        <TodoDate />
        <ItemList />
      </div>
    </AppStateProvider>
  );
}

export default App;