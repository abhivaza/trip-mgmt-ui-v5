"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Share, Trash2, Map } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/context/api-provider";
import { DeleteConfirmDialog } from "./delete-confirmation-dialog";
import type { Itinerary } from "@/types/itinerary";
import { useNavigate } from "react-router-dom";

interface ShareTripDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: (email: string) => Promise<void>;
  tripId: string;
  sharedWith: string[];
}

interface ShareTripButtonProps {
  trip: Itinerary;
  className?: string;
}

interface SharedUser {
  id: string;
  email: string;
  name: string | null;
}

// Define the form schema
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
});

function ShareTripDialog({
  isOpen,
  onOpenChange,
  onShare,
  tripId,
  sharedWith,
}: ShareTripDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<SharedUser | null>(null);
  const api = useApi();
  const { toast } = useToast();
  const router = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await api.delete(`/app/trip/${tripId}/share/${userToDelete.email}`);
      toast({
        title: "Success",
        description: "User removed from shared trip.",
      });
    } catch (error) {
      console.error("Error removing user:", error);
      toast({
        title: "Error",
        description: "Failed to remove user from shared trip.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      onOpenChange(false);
      router(0);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await onShare(values.email);
      form.reset();
    } catch (error) {
      console.error("Error sharing trip:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share this trip</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you want to share this trip
              with.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Email</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input placeholder="friend@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {sharedWith && sharedWith.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Shared with:</h4>
                  <ul className="space-y-2">
                    {sharedWith.map((email, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between text-sm p-2 bg-muted rounded-md"
                      >
                        <span className="truncate max-w-[250px]">{email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUserToDelete({
                              id: index.toString(),
                              email,
                              name: null,
                            });
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sharing..." : "Share Trip"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteUser}
        title="Remove user from shared trip?"
        description={`Are you sure you want to remove ${
          userToDelete?.name || userToDelete?.email || "this user"
        } from this shared trip?`}
        confirmText="Remove"
      />
    </>
  );
}

export function TripToolbar({ trip, className }: ShareTripButtonProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const api = useApi();
  const { toast } = useToast();
  const router = useNavigate();

  const handleShare = async (email: string) => {
    try {
      await api.post(`/app/trip/${trip.id}/share`, { email });
      setIsShareDialogOpen(false);
      toast({
        title: "Success",
        description: "Trip shared successfully!",
      });
    } catch (error) {
      console.error("Error sharing trip:", error);
      toast({
        title: "Error",
        description: "Failed to share trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsShareDialogOpen(false);
      router(0);
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await api.delete(`/app/trip/${trip.id}`);
      toast({
        title: "Success",
        description: "Trip deleted successfully!",
      });

      router("/app/trips");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast({
        title: "Error",
        description: "Failed to delete trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router(`/app/trip/${trip.id}/map`)}
      >
        <Map className="mr-2 h-4 w-4" />
        Map View
      </Button>
      <div className={`flex gap-2 ${className || ""}`}>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsShareDialogOpen(true)}
        >
          <Share className="w-4 h-4" />
          Share
        </Button>

        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>

      <ShareTripDialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        onShare={handleShare}
        tripId={trip.id || ""}
        sharedWith={trip.sharedWith || []}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTrip}
        title="Delete trip?"
        description="Are you sure you want to delete this trip? This action cannot be undone."
      />
    </div>
  );
}
