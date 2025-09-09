# OpenWebUI Configuration Tool - User Guide

## Getting Started

The OpenWebUI Configuration Tool helps you generate valid configuration files for OpenWebUI deployments through an intuitive visual interface.

### Step 1: Choose Your Editor Mode

When you visit [openwebui-config.com](https://openwebui-config.com), you can choose between:

- **Form Editor**: Visual form with categorized fields (recommended for most users)
- **Raw Editor**: Direct text editing for advanced users

### Step 2: Configure Your Settings

#### Using the Form Editor

1. **Navigate Categories**: Use the sidebar to jump between configuration categories
2. **Fill Required Fields**: Fields marked with * are required
3. **Watch for Conditional Fields**: Some fields only appear when related features are enabled
4. **Validation Feedback**: Red error messages indicate invalid values

#### Common Configuration Scenarios

##### Basic Setup
1. Set `WEBUI_URL` to your deployment URL
2. Configure signup settings (`ENABLE_SIGNUP`, `DEFAULT_USER_ROLE`)
3. Set up your preferred AI provider

##### OpenAI Integration
1. Check "Enable OpenAI API"
2. Enter your OpenAI API key (starts with `sk-`)
3. Optional: Configure model preferences and endpoints

##### Database Configuration
1. Choose your database type (PostgreSQL, MySQL, or SQLite)
2. Enter connection details if using external database
3. Configure connection pooling if needed

### Step 3: Export Your Configuration

Once you've configured your settings:

1. Click the **Export** button
2. Choose your format:
   - **ENV File**: Standard `.env` format for Docker deployments
   - **JSON**: For programmatic use or backup
   - **Docker Compose**: Ready-to-use Docker environment variables

### Step 4: Import Existing Configuration

To modify an existing configuration:

1. Click **Import**
2. Select your `.env` or JSON file
3. The form will populate with your existing values
4. Make your changes and export the updated configuration

## Features

### Auto-Save
Your configuration is automatically saved to browser localStorage as you work. You can close the browser and return later to continue.

### Validation
- **Real-time validation** ensures your configuration is valid
- **Format checking** for URLs, email addresses, and API keys
- **Range validation** for numeric values
- **Required field checking** prevents missing critical settings

### Conditional Fields
The form intelligently shows/hides fields based on your selections:
- Enable OpenAI → Shows OpenAI-specific settings
- Enable OAuth → Shows OAuth configuration fields
- Enable S3 → Shows S3 bucket configuration

### Search and Filter
Use the search box to quickly find specific configuration options across all categories.

## Tips and Best Practices

1. **Start with Defaults**: Many fields have sensible defaults - only change what you need
2. **Test Locally First**: Export and test your configuration in a local environment
3. **Keep API Keys Secure**: Never commit `.env` files with API keys to version control
4. **Use Comments**: The exported `.env` file includes helpful comments for each setting
5. **Backup Configurations**: Export and save different configurations for different environments

## Troubleshooting

### Form Won't Load
- Clear browser cache and refresh
- Check browser console for errors
- Try a different browser

### Import Fails
- Ensure file is valid `.env` or JSON format
- Check for syntax errors in the file
- Remove any non-standard characters

### Validation Errors
- Hover over error messages for details
- Check format requirements (e.g., URLs must include protocol)
- Ensure numeric values are within allowed ranges

### Export Issues
- Check browser download settings
- Try a different export format
- Clear browser storage if export is empty

## Keyboard Shortcuts

- `Tab` - Navigate forward through fields
- `Shift+Tab` - Navigate backward
- `Enter` - Submit/confirm in dialogs
- `Escape` - Close dialogs

## Browser Support

The tool works best in modern browsers:
- Chrome 120+
- Firefox 115+
- Safari 16+
- Edge 120+

## Getting Help

- **Documentation**: Check the [Field Reference](field-reference.md) for detailed field descriptions
- **GitHub Issues**: Report bugs or request features at [GitHub](https://github.com/leger-labs/openwebui-config.com/issues)
- **OpenWebUI Docs**: Refer to [OpenWebUI Documentation](https://docs.openwebui.com) for deployment help