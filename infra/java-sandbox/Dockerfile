# Minimal JDK image used per-submission by apps/api/src/execution/dockerRunner.ts.
# Explicitly the DEV-ONLY execution image for ROADMAP.md Milestone 3 (SECURITY.md:
# this is not the hardened Milestone-4 sandbox and must never run untrusted code
# reachable from the public internet). Debian-based so `timeout` (coreutils) is
# available for the compile/run wall-clock limits.
FROM eclipse-temurin:21-jdk-jammy

# No extra packages: smaller surface, nothing a submission could use beyond the
# JDK + coreutils already present in the base image.
