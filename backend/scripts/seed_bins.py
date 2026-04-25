from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from main import read_all, seed_memory, write_doc  # noqa: E402


def main() -> None:
    seed_memory()
    bins = read_all("bins")
    for bin_item in bins:
        write_doc("bins", str(bin_item["bin_id"]), bin_item)
    print(f"Seeded {len(bins)} bins")


if __name__ == "__main__":
    main()
