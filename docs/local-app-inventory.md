# Local App Inventory

This document records the local inventory of the user's professional development and side-project repositories found on `C:\Users\joshua.parris`.

## Scan Overview

- Scan root: `C:\Users\joshua.parris`
- Search included top-level directories and nested repos under the user profile
- Focused on app names, repo names, and known project folders from the provided app list
- Search included local folders such as `JoshHub`, `dev`, `Documents`, and published output folders

## Found Locally

### Direct repositories and project folders
- `JoshHub`
- `JoshPath`
- `NebulaDice`
  - `C:\Users\joshua.parris\dev\NebulaDice`
  - `C:\Users\joshua.parris\Documents\NebulaDice`
  - `C:\Users\joshua.parris\NebulaDice-Browser-publish`
- `Parris-Life-Dashboard`
  - `C:\Users\joshua.parris\Parris-Life-Dashboard-clean-publish`
  - `C:\Users\joshua.parris\Parris-Life-Dashboard-publish`
  - `C:\Users\joshua.parris\Parris-Life-Dashboard-web-deploy`
- `DCSPrep` / `DCSPrepApp`
  - `C:\Users\joshua.parris\Downloads\dcsprep_surprise_6_json_files`
  - `C:\Users\joshua.parris\OneDrive - Dubbo Christian School\Documents\DCSPrepApp`
- `HugCoach`
  - `C:\Users\joshua.parris\JoshHub\archive\experiments\experimental\hugcoach`
- `OrgScape`
  - `C:\Users\joshua.parris\JoshHub\public\games\orgscape`
  - `C:\Users\joshua.parris\JoshHub\public\games\orgscape\orgscapev2`
- `Wilds`
  - `C:\Users\joshua.parris\JoshHub\public\games\wilds-2`
  - `C:\Users\joshua.parris\JoshHub\public\games\wilds-main`
  - `C:\Users\joshua.parris\JoshHub\public\games\wilds-sail-west`
  - `C:\Users\joshua.parris\JoshHub\Wilds - Sail West`

## Not Found in This Scan

The following app/repo names were not detected within `C:\Users\joshua.parris` during the scan:

- `DCSCompanion`
- `DCSProfessionalDevelopment`
- `DCSPD`
- `ParrisTechApp`
- `ParrisTechServicesApp`
- `ClearCore`
- `LifeHub`
- `ParrisPiano`
- `WhirringWilderness`
- `campaign-copilot`
- `BucklandBlocks`
- `ParrisDubboMoverApp`
- `MysteriousDepths`
- `Null`
- `LetsPlayDnd`
- `Wastes-courier-roguelike`
- `joshualparris-max`
- `joshuaparris-max`
- `joshuaparrisdadlan-stack`

## Notes

- The scan was performed from the user's home directory and identified both root repos and embedded project folders.
- Some matches were found in published output directories (`publish`, `web-deploy`) rather than active source trees.
- If desired, this inventory can be extended with a deeper search into `OneDrive`, `JoshHub/archive`, or other storage locations.

## GitHub Sync Status

### Git-tracked repositories and comparison results
- `C:\Users\joshua.parris\JoshHub`
  - Remote: `https://github.com/joshualparris/JoshHub.git`
  - Branch: `main`
  - Local state: behind remote by 6 commits
  - Notes: this local repo also contains working tree changes and untracked files.
- `C:\Users\joshua.parris\NebulaDice-Browser-publish`
  - Remote: `https://github.com/joshualparris/NebulaDice-Browser.git`
  - Branch: `main`
  - Local state: in sync with remote
- `C:\Users\joshua.parris\Parris-Life-Dashboard-clean-publish`
  - Remote: `https://github.com/joshualparris/Parris-Life-Dashboard.git`
  - Branch: `main`
  - Local state: behind remote by 7 commits
- `C:\Users\joshua.parris\OneDrive - Dubbo Christian School\Documents\DCSPrepApp`
  - Remote: `https://github.com/joshualparris/DCSPD.git`
  - Branch: `main`
  - Local state: in sync with remote

### Paths without git repository metadata
- `C:\Users\joshua.parris\JoshPath`
- `C:\Users\joshua.parris\dev\NebulaDice`
- `C:\Users\joshua.parris\Documents\NebulaDice`
- `C:\Users\joshua.parris\Parris-Life-Dashboard-publish`
- `C:\Users\joshua.parris\Parris-Life-Dashboard-web-deploy`
- `C:\Users\joshua.parris\Downloads\dcsprep_surprise_6_json_files`

### Notes
- Many of the nested `JoshHub` folders are part of the same `JoshHub` git repository, not separate remotes.
- The GitHub sync status was refreshed by fetching each repo's origin before checking branch ahead/behind counts.
- The reported behind counts mean those local folders are missing commits that exist on the GitHub `origin/main` branch.
