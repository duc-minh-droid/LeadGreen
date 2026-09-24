import React, { useRef, useEffect, useState } from "react";
import OverLeafBar from "./OverLeafBar";
import RouletteButton from "./RouletteButton";
import PlantDisplay from "./PlantDisplay";
import StatsDisplay from "./StatsDisplay";
import ConfettiEffect from "./ConfettiEffect";
import useGameData from "../../Hooks/useGameData";
import usePlantEffects from "../../Hooks/usePlantEffects";
import GardenShop from "./PopShop";
import { fetchInventory } from "./gameService";
import DailyRewards from "./DailyRewards/DailyRewards";

const OverLeaf = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [shopOpen, setShopOpen] = useState(false);
  const plantRef = useRef(null);
  const [inventory, setInventory] = useState([]);
  // Little "+10% growth" labels that float up from the plant after an action
  const [floaters, setFloaters] = useState([]);
  const addFloater = (text) => {
    const id = Date.now() + Math.random();
    setFloaters((f) => [...f, { id, text }]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1400);
  };

  // Fetch inventory data
  const loadInventory = async () => {
    try {
      const data = await fetchInventory();
      const formattedInventory = data.map((item) => ({
        id: item.item.id,
        label: item.item.name,
        amount: item.quantity,
        image: item.item.image,
      }));
      setInventory(formattedInventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const {
    user,
    setUser,
    loading,
    currentInsect,
    fetchUserData,
    executeAction,
    scale,
    prevLevel,
    initialLoad,
    leveledUp,
    setLeveledUp,
    oldPlantName,
  } = useGameData();

  const {
    showConfetti,
    wiggle,
    triggerWiggle,
    showLevelUpEffects,
    playActionSound,
    showInsectAlert,
    playErrorSound,
  } = usePlantEffects(plantRef);

  useEffect(() => {
    if (leveledUp && oldPlantName) {
      showLevelUpEffects(oldPlantName);
      setLeveledUp(false);
    }
  }, [leveledUp, oldPlantName, showLevelUpEffects, setLeveledUp]);

  // Track previous insect for comparison
  const prevInsectRef = useRef(null);

  useEffect(() => {
    if (currentInsect && initialLoad === false) {
      if (!prevInsectRef.current || prevInsectRef.current.name !== currentInsect.name) {
        showInsectAlert(currentInsect.name);
      }
    }
    prevInsectRef.current = currentInsect;
  }, [currentInsect, initialLoad, showInsectAlert]);

  const handleAction = async () => {
    if (!selectedIcon) {
      triggerWiggle();
      return;
    }

    const item = inventory.find((i) => i.id === selectedIcon);

    if (!item || item.amount <= 0) {
      setSelectedIcon(null);
      triggerWiggle();
      return;
    }

    setInventory((prev) =>
      prev
        .map((i) => (i.id === selectedIcon ? { ...i, amount: i.amount - 1 } : i))
        .filter((i) => i.amount > 0)
    );

    const before = user ? user.tree_level + (user.growth || 0) : 0;
    const result = await executeAction(selectedIcon);

    if (result.success) {
      playActionSound(selectedIcon);
      const tree = result.data.tree;
      const delta = tree.level + tree.growth - before;
      if (delta > 0.001) addFloater(`+${Math.round(delta * 100)}% growth`);
      else if (/insect removed/i.test(result.data.message || "")) addFloater("Bug removed!");
      else addFloater(item.label);

      const serverInventory = await fetchInventory();
      const serverItem = serverInventory.find((i) => i.item.id === selectedIcon);
      if (!serverItem || serverItem.quantity !== item.amount - 1) {
        const formattedInventory = serverInventory.map((item) => ({
          id: item.item.id,
          label: item.item.name,
          amount: item.quantity,
          image: item.item.image,
        }));
        setInventory(formattedInventory);
      }

      if (item.amount - 1 <= 0) {
        setSelectedIcon(null);
      }
    } else {
      await loadInventory();
      playErrorSound();
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3 text-green-800">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
        <p className="font-semibold">Watering your garden...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      <ConfettiEffect show={showConfetti} />

      {/* Top Section: OverLeafBar, StatsDisplay, etc. */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col justify-center items-start p-4 space-y-4">
          <OverLeafBar setSelectedIcon={setSelectedIcon} inventory={inventory} selectedIcon={selectedIcon} />
          <StatsDisplay user={user} />
          <RouletteButton user={user} setUser={setUser} />
          <DailyRewards setUser={setUser} setInventory={setInventory} loadInventory={loadInventory}/>
        </div>
        <div className="flex flex-col justify-center items-end p-4">
          <GardenShop.ShopButton onClick={() => setShopOpen(true)} />
        </div>
      </div>

      {/* Center: Plant Display */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <PlantDisplay
          plantRef={plantRef}
          wiggle={wiggle}
          scale={scale}
          plantImage={user.plant_image}
          plantName={user.plant_name}
          insect={currentInsect}
          onClick={handleAction}
          floaters={floaters}
          hint={
            currentInsect
              ? "A bug! Select the glove and tap the plant"
              : selectedIcon
                ? "Tap the plant to use it"
                : inventory.length
                  ? "Pick an item below, then tap the plant"
                  : "Buy items in the shop to grow your plant"
          }
        />
      </div>

      {/* Shop Popup */}
      <GardenShop
        isOpen={shopOpen}
        onClose={() => setShopOpen(false)}
        user={user}
        setUser={setUser}
        onPurchase={loadInventory}
      />
    </div>
  );
};

export default OverLeaf;