"""Import statistics and final report generation."""

import time
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class ImportReport:
    """Accumulates statistics during the import and renders the final report."""

    time_start: float = field(default_factory=time.time)
    time_end: float = 0.0

    csv_rows_read: int = 0
    csv_valid: int = 0
    csv_skipped_invalid: int = 0

    skipped_missing_image: int = 0
    rows_with_images: int = 0

    total_processed: int = 0
    imported: int = 0
    skipped_duplicate_slug: int = 0
    skipped_db_error: int = 0
    skipped_image_upload: int = 0

    descriptions_built: int = 0
    images_uploaded: int = 0
    images_upload_failed: int = 0

    @property
    def total_skipped(self) -> int:
        return (
            self.csv_skipped_invalid
            + self.skipped_missing_image
            + self.skipped_duplicate_slug
            + self.skipped_db_error
            + self.skipped_image_upload
        )

    @property
    def elapsed_seconds(self) -> float:
        end = self.time_end if self.time_end > 0 else time.time()
        return end - self.time_start

    def finish(self) -> None:
        self.time_end = time.time()

    def print(self) -> None:
        separator = "=" * 60
        elapsed = self.elapsed_seconds
        minutes = int(elapsed // 60)
        seconds = int(elapsed % 60)

        print(f"\n{separator}")
        print("IMPORT REPORT")
        print(separator)
        start_dt = datetime.fromtimestamp(self.time_start)
        end_dt = datetime.fromtimestamp(self.time_end or time.time())
        print(f"Started:  {start_dt:%Y-%m-%d %H:%M:%S}")
        print(f"Finished: {end_dt:%Y-%m-%d %H:%M:%S}")
        print(f"Duration: {minutes}m {seconds}s")
        print()
        print(f"CSV rows read:             {self.csv_rows_read:>6,}")
        print(f"Valid rows:                {self.csv_valid:>6,}")
        print()
        print(f"Products imported:         {self.imported:>6,}")
        print(f"Products skipped:          {self.total_skipped:>6,}")
        print(f"  - Invalid CSV row:       {self.csv_skipped_invalid:>6,}")
        print(f"  - Missing image:         {self.skipped_missing_image:>6,}")
        print(f"  - Duplicate slug:        {self.skipped_duplicate_slug:>6,}")
        print(f"  - Image upload failed:   {self.skipped_image_upload:>6,}")
        print(f"  - DB insert error:       {self.skipped_db_error:>6,}")
        print()
        print(f"Descriptions built:        {self.descriptions_built:>6,}")
        print(f"Images uploaded:           {self.images_uploaded:>6,}")
        print(f"Image uploads failed:      {self.images_upload_failed:>6,}")
        print(separator)
