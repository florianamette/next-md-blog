#!/bin/bash

# Script to create two test Next.js projects and initialize them with next-md-blog CLI
# Creates one single-language project and one multi-language project
# Uses create-next-app to set up the projects

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
TEST_DIR="test"
SINGLE_LANG_PROJECT="test-blog-single"
MULTI_LANG_PROJECT="test-blog-multi"

echo -e "${BLUE}🚀 Setting up test projects...${NC}\n"

# Get the script directory (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SINGLE_LANG_DIR="$SCRIPT_DIR/$TEST_DIR/$SINGLE_LANG_PROJECT"
MULTI_LANG_DIR="$SCRIPT_DIR/$TEST_DIR/$MULTI_LANG_PROJECT"

# Clean up if directories exist
if [ -d "$SINGLE_LANG_DIR" ]; then
  echo -e "${YELLOW}⚠️  Single-language test project directory already exists. Removing it...${NC}"
  rm -rf "$SINGLE_LANG_DIR"
fi

if [ -d "$MULTI_LANG_DIR" ]; then
  echo -e "${YELLOW}⚠️  Multi-language test project directory already exists. Removing it...${NC}"
  rm -rf "$MULTI_LANG_DIR"
fi

# Create test directory
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo -e "${GREEN}✓ Created test directory${NC}"

# Build the CLI if needed
echo -e "${BLUE}🔨 Building CLI...${NC}"
cd "$SCRIPT_DIR/packages/cli"
npm run build
echo -e "${GREEN}✓ CLI built${NC}"

# Return to test directory
cd "$SCRIPT_DIR/$TEST_DIR"

# Determine the correct CLI path (the CLI is compiled to packages/cli/dist/cli.js)
CLI_PATH="$SCRIPT_DIR/packages/cli/dist/cli.js"
if [ ! -f "$CLI_PATH" ]; then
  echo -e "${YELLOW}❌ Error: CLI file not found at $CLI_PATH${NC}"
  echo -e "${YELLOW}   Please run 'npm run build:cli' in the root directory first.${NC}"
  exit 1
fi

# Calculate relative path from test project to repo root
# test/test-blog-* -> ../../ (go up 2 levels)
RELATIVE_PATH_TO_ROOT="../../"

# Function to create a project
create_project() {
  local PROJECT_NAME=$1
  local PROJECT_DIR=$2
  local I18N_ENABLED=$3
  local PROJECT_TYPE=$4
  
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}📦 Creating ${PROJECT_TYPE} project...${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
  
  # Ensure we're in the test directory before creating the project
  cd "$SCRIPT_DIR/$TEST_DIR"
  
  # Create Next.js project using create-next-app
  echo -e "${BLUE}📦 Creating Next.js project with create-next-app...${NC}"
  
  npx --yes create-next-app@latest "$PROJECT_NAME" \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --import-alias "@/*" \
    --yes
  
  echo -e "${GREEN}✓ Next.js project created${NC}"
  
  # Run the CLI in non-interactive mode
  cd "$PROJECT_DIR"
  echo -e "${BLUE}📝 Running next-md-blog CLI in non-interactive mode...${NC}\n"
  
  # Build CLI arguments
  local CLI_ARGS=(
    --non-interactive
    --content-dir="posts"
    --blog-route="blog"
    --blogs-route="blogs"
    --example-post
    --blog-pages
    --og-image
    --site-name="Test Blog ${PROJECT_TYPE}"
    --site-url="https://test.example.com"
    --author="Test Author"
    --twitter="@test"
  )
  
  # Add i18n flag and locales if enabled
  if [ "$I18N_ENABLED" = "true" ]; then
    CLI_ARGS+=(--i18n-enabled)
    CLI_ARGS+=(--locales="en,fr")
  fi
  
  # Use node to run the CLI directly from dist
  node "$CLI_PATH" "${CLI_ARGS[@]}"
  
  # Verify locale folders and posts were created for multi-language projects
  if [ "$I18N_ENABLED" = "true" ]; then
    echo -e "\n${BLUE}🔍 Verifying multi-language setup...${NC}"
    if [ -d "$PROJECT_DIR/posts/en" ]; then
      echo -e "${GREEN}✓ posts/en directory created${NC}"
    else
      echo -e "${YELLOW}⚠️  posts/en directory not found${NC}"
    fi
    if [ -d "$PROJECT_DIR/posts/fr" ]; then
      echo -e "${GREEN}✓ posts/fr directory created${NC}"
    else
      echo -e "${YELLOW}⚠️  posts/fr directory not found${NC}"
    fi
    if [ -f "$PROJECT_DIR/posts/en/welcome.md" ]; then
      echo -e "${GREEN}✓ posts/en/welcome.md created${NC}"
    else
      echo -e "${YELLOW}⚠️  posts/en/welcome.md not found${NC}"
    fi
    if [ -f "$PROJECT_DIR/posts/fr/welcome.md" ]; then
      echo -e "${GREEN}✓ posts/fr/welcome.md created${NC}"
    else
      echo -e "${YELLOW}⚠️  posts/fr/welcome.md not found${NC}"
    fi
  else
    # Verify single-language setup
    echo -e "\n${BLUE}🔍 Verifying single-language setup...${NC}"
    if [ -f "$PROJECT_DIR/posts/welcome.md" ]; then
      echo -e "${GREEN}✓ posts/welcome.md created${NC}"
    else
      echo -e "${YELLOW}⚠️  posts/welcome.md not found${NC}"
    fi
  fi
  
  # Update package.json to use local package version
  echo -e "\n${BLUE}📦 Updating package.json to use local package...${NC}"
  
  if [ -f "$PROJECT_DIR/package.json" ]; then
    # Use node to update package.json (more reliable than sed for JSON)
    node -e "
      const fs = require('fs');
      const path = '${PROJECT_DIR}/package.json';
      const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
      if (!pkg.dependencies) pkg.dependencies = {};
      pkg.dependencies['@next-md-blog/core'] = 'file:${RELATIVE_PATH_TO_ROOT}packages/core';
      fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
    "
    echo -e "${GREEN}✓ package.json updated to use local package${NC}"
  else
    echo -e "${YELLOW}⚠️  package.json not found, skipping update${NC}"
  fi
  
  echo -e "${GREEN}✅ ${PROJECT_TYPE} project setup complete!${NC}"
  echo -e "${BLUE}📁 Project location: $PROJECT_DIR${NC}\n"
  
  # Return to test directory for next project
  cd "$SCRIPT_DIR/$TEST_DIR"
}

# Create single-language project
create_project "$SINGLE_LANG_PROJECT" "$SINGLE_LANG_DIR" "false" "Single-Language"

# Create multi-language project
create_project "$MULTI_LANG_PROJECT" "$MULTI_LANG_DIR" "true" "Multi-Language"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ All test projects setup complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
echo -e "${BLUE}📁 Single-language project: $SINGLE_LANG_DIR${NC}"
echo -e "${BLUE}📁 Multi-language project: $MULTI_LANG_DIR${NC}\n"
