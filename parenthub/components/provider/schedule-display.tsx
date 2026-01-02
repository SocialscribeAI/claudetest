/**
 * SCHEDULE DISPLAY - components/provider/schedule-display.tsx
 *
 * Purpose: Display provider's weekly schedule
 *
 * Display:
 * - Days of the week
 * - Open/closed status per day
 * - Hours for each day
 * - Current status (Open now / Closed)
 * - Next opening time
 *
 * Format:
 * - Sunday: 09:00 - 18:00
 * - Monday: 09:00 - 18:00
 * - Saturday: Closed
 *
 * Props:
 * - schedule: WeeklySchedule
 * - showCurrentStatus: boolean
 * - compact: boolean (single line for cards)
 *
 * Types:
 * WeeklySchedule = {
 *   [day: string]: { open: string, close: string } | null
 * }
 */

interface DaySchedule {
  open: string;
  close: string;
}

interface ScheduleDisplayProps {
  schedule: Record<string, DaySchedule | null>;
  showCurrentStatus?: boolean;
  compact?: boolean;
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hebrewDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export function ScheduleDisplay({
  schedule,
  showCurrentStatus = true,
  compact = false,
}: ScheduleDisplayProps) {
  const isOpenNow = (): boolean => {
    const now = new Date();
    const dayName = days[now.getDay()];
    const daySchedule = schedule[dayName.toLowerCase()];
    if (!daySchedule) return false;

    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(daySchedule.open.replace(":", ""));
    const closeTime = parseInt(daySchedule.close.replace(":", ""));

    return currentTime >= openTime && currentTime <= closeTime;
  };

  if (compact) {
    return (
      <span className={`text-sm ${isOpenNow() ? "text-green-600" : "text-gray-500"}`}>
        {isOpenNow() ? "Open now" : "Closed"}
      </span>
    );
  }

  return (
    <div className="space-y-2">
      {showCurrentStatus && (
        <div className={`font-medium ${isOpenNow() ? "text-green-600" : "text-red-500"}`}>
          {isOpenNow() ? "● Open now" : "● Closed"}
        </div>
      )}
      <div className="space-y-1">
        {days.map((day, i) => {
          const daySchedule = schedule[day.toLowerCase()];
          return (
            <div key={day} className="flex justify-between text-sm">
              <span>{hebrewDays[i]}</span>
              <span className="text-gray-600">
                {daySchedule ? `${daySchedule.open} - ${daySchedule.close}` : "Closed"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
