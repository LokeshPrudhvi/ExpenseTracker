import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Plus, Trash2, FolderPlus } from "lucide-react";
import { toast } from "sonner@2.0.3";

export interface CustomCategory {
  value: string; // Unique slug
  label: string; // Display name
  icon: string; // Emoji icon
  color: string; // Tailwind color class
  createdAt: string;
}

interface CustomCategoriesProps {
  categories: CustomCategory[];
  onUpdate: (categories: CustomCategory[]) => void;
}

// Emoji presets for users to choose from
const EMOJI_PRESETS = [
  "💼", "🏦", "💳", "🎓", "🏋️", "🎮", "📱", "💻", "🚴",
  "🎨", "🎵", "📺", "🏖️", "✈️", "🍕", "🍜", "🥗", "🍺",
  "👔", "👗", "👟", "💄", "🏡", "🔧", "🌱", "🐕", "🎁",
  "📦", "🔌", "🌐", "📚", "✏️", "💊", "🧘", "🏃", "⚽",
];

const COLOR_PRESETS = [
  { name: "Red", class: "text-red-500" },
  { name: "Orange", class: "text-orange-500" },
  { name: "Amber", class: "text-amber-500" },
  { name: "Yellow", class: "text-yellow-500" },
  { name: "Lime", class: "text-lime-500" },
  { name: "Green", class: "text-green-500" },
  { name: "Emerald", class: "text-emerald-500" },
  { name: "Teal", class: "text-teal-500" },
  { name: "Cyan", class: "text-cyan-500" },
  { name: "Sky", class: "text-sky-500" },
  { name: "Blue", class: "text-blue-500" },
  { name: "Indigo", class: "text-indigo-500" },
  { name: "Violet", class: "text-violet-500" },
  { name: "Purple", class: "text-purple-500" },
  { name: "Fuchsia", class: "text-fuchsia-500" },
  { name: "Pink", class: "text-pink-500" },
  { name: "Rose", class: "text-rose-500" },
];

export function CustomCategories({
  categories,
  onUpdate,
}: CustomCategoriesProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("📋");
  const [color, setColor] = useState("text-blue-500");

  const handleAdd = () => {
    if (!label.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    // Create slug from label
    const value = label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check for duplicates
    if (categories.some((cat) => cat.value === value)) {
      toast.error("Category with this name already exists");
      return;
    }

    const newCategory: CustomCategory = {
      value,
      label: label.trim(),
      icon,
      color,
      createdAt: new Date().toISOString(),
    };

    onUpdate([...categories, newCategory]);
    toast.success("✅ Custom category added!");

    // Reset form
    setLabel("");
    setIcon("📋");
    setColor("text-blue-500");
    setShowDialog(false);
  };

  const handleDelete = (value: string) => {
    onUpdate(categories.filter((cat) => cat.value !== value));
    setDeleteId(null);
    toast.success("Custom category deleted");
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <p className="text-sm text-indigo-900 dark:text-indigo-100">
          🎨 Create your own expense categories with custom names and icons
        </p>
      </div>

      {/* Add Button */}
      <Card className="p-6 shadow-xl">
        <Button onClick={() => setShowDialog(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Category
        </Button>
      </Card>

      {/* Categories List */}
      {categories.length === 0 ? (
        <Card className="p-8 text-center shadow-xl">
          <FolderPlus className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <h4>No Custom Categories</h4>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Create custom categories for your unique expenses
          </p>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Category
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          <h4 className="text-sm text-muted-foreground">
            Your Custom Categories ({categories.length})
          </h4>
          {categories.map((category) => (
            <Card key={category.value} className="p-4 shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{category.icon}</div>
                  <div>
                    <h4>{category.label}</h4>
                    <p className="text-xs text-muted-foreground">
                      Added{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={`${category.color} border-0 bg-opacity-20`}>
                    {category.value}
                  </Badge>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteId(category.value)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Custom Category</DialogTitle>
            <DialogDescription>
              Create a custom expense category with your own name and icon.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="label">Category Name</Label>
              <Input
                id="label"
                placeholder="e.g., Gym Membership, Pet Care, Hobbies"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Icon</Label>
              <div className="mt-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-4xl">{icon}</div>
                  <Input
                    placeholder="Or paste emoji"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value.slice(0, 2))}
                    className="w-24"
                    maxLength={2}
                  />
                </div>
                <div className="grid grid-cols-9 gap-2">
                  {EMOJI_PRESETS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`text-2xl p-2 rounded hover:bg-accent transition-colors ${
                        icon === emoji ? "bg-accent" : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.class}
                    type="button"
                    onClick={() => setColor(preset.class)}
                    className={`p-3 rounded border-2 transition-all ${
                      color === preset.class
                        ? "border-primary scale-110"
                        : "border-transparent hover:border-muted"
                    }`}
                  >
                    <div className={`w-full h-4 ${preset.class}`}>●</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{icon}</span>
                <span className={color}>{label || "Category Name"}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the category. Existing expenses using this
              category will keep their category name but won't show the custom
              icon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
