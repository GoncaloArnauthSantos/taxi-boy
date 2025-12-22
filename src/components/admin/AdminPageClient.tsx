"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  createBooking,
  getBookings,
  deleteBooking,
  updateBooking,
  BookingApiError,
} from "@/client/api/bookings";
import DeleteBookingDialog from "./DeleteBookingDialog";
import type { Booking, BookingStatus } from "@/domain/booking";
import type { Tour } from "@/cms/types";
import type { BookingFormValues } from "@/app/api/bookings/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

type Props = {
  tours: Tour[];
};

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "cancelled"];

const AdminPageClient = ({ tours }: Props) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Update state
  const [updateId, setUpdateId] = useState("");
  const [updateStatus, setUpdateStatus] = useState<BookingStatus>("pending");

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const refreshBookings = useCallback(async () => {
    try {
      setLoading(true);
      const allBookings = await getBookings();
      setBookings(allBookings);
    } catch (error) {
      showMessage(
        "error",
        error instanceof BookingApiError
          ? error.message
          : "Failed to fetch bookings"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  const handleCreateMockBooking = async () => {
    if (tours.length === 0) {
      showMessage(
        "error",
        "No tours available. Please ensure tours are configured in CMS."
      );
      return;
    }

    try {
      setLoading(true);
      const randomTour = tours[0];
      const randomDate = new Date();
      randomDate.setDate(
        randomDate.getDate() + Math.floor(Math.random() * 30) + 1
      );

      const mockFormData: BookingFormValues = {
        name: `Mock User Gonçalo`,
        email: `goncaloarnauth@outlook.com`,
        phonePhoneCountryCode: "+351",
        phoneNumber: `912345${Math.floor(Math.random() * 1000)}`,
        country: "Portugal",
        language: "English",
        tourId: randomTour.id,
        date: randomDate,
        message: "This is a mock booking created for testing purposes.",
      };

      await createBooking(mockFormData);
      showMessage("success", "Mock booking created successfully!");
      await refreshBookings();
    } catch (error) {
      showMessage(
        "error",
        error instanceof BookingApiError
          ? error.message
          : "Failed to create mock booking"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!updateId.trim()) {
      showMessage("error", "Please enter a booking ID");
      return;
    }

    try {
      setLoading(true);
      await updateBooking(updateId.trim(), { status: updateStatus });
      showMessage("success", `Booking status updated to "${updateStatus}"!`);
      setUpdateId("");
      setUpdateStatus("pending");
      await refreshBookings();
    } catch (error) {
      showMessage(
        "error",
        error instanceof BookingApiError
          ? error.message
          : "Failed to update booking"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (booking: Booking) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;

    try {
      setLoading(true);
      await deleteBooking(bookingToDelete.id);
      showMessage("success", "Booking deleted successfully!");
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
      await refreshBookings();
    } catch (error) {
      showMessage(
        "error",
        error instanceof BookingApiError
          ? error.message
          : "Failed to delete booking"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingClick = (booking: Booking) => {
    setUpdateId(booking.id);
    setUpdateStatus(booking.status);
    // Scroll to update section
    document
      .getElementById("update-booking-section")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Bookings Management</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage all tour bookings from this panel
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Create Mock Booking */}
        <Card>
          <CardHeader>
            <CardTitle>Create Mock Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Creates a random booking with mock data for testing.
            </p>
            <Button
              onClick={handleCreateMockBooking}
              disabled={loading || tours.length === 0}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Mock Booking"}
            </Button>
          </CardContent>
        </Card>

        {/* Update Booking Status */}
        <Card id="update-booking-section">
          <CardHeader>
            <CardTitle>Update Booking Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Update the status of a booking by ID.
            </p>
            <Input
              placeholder="Booking ID"
              value={updateId}
              onChange={(e) => setUpdateId(e.target.value)}
              disabled={loading}
              className="mb-2"
            />
            <Select
              value={updateStatus}
              onValueChange={(value) => setUpdateStatus(value as BookingStatus)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleUpdate}
              disabled={loading || !updateId.trim()}
              className="w-full mt-2"
            >
              Update Status
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="mb-6">
        <Button onClick={refreshBookings} disabled={loading} variant="outline">
          {loading ? "Loading..." : "Refresh Bookings List"}
        </Button>
      </div>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No bookings found. Create a mock booking to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          {booking.clientName}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            booking.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : booking.paymentStatus === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Booking ID: {booking.id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Email: {booking.clientEmail}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Selected Date:{" "}
                        {new Date(
                          booking.clientSelectedDate
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tour ID: {booking.tourId}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created At:{" "}
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated At:{" "}
                        {new Date(booking.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleUpdateBookingClick(booking)}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                      >
                        Update Status
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(booking)}
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteBookingDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setBookingToDelete(null);
          }
        }}
        booking={bookingToDelete}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </div>
  );
};

export default AdminPageClient;
