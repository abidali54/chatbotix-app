import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Grid, Select, 
  MenuItem, Typography, Tabs, Tab, Dialog, DialogContent,
  DialogTitle, IconButton, Tooltip, List, ListItem,
  ListItemText, Chip
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { Preview, History, Analytics, PersonAdd } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip } from 'recharts';

const EmailTemplateEditor = () => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [abTestActive, setAbTestActive] = useState(false);
  const [variants, setVariants] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const response = await fetch('/api/admin/email-templates');
    const data = await response.json();
    setTemplates(data);
  };

  const handleSave = async () => {
    await fetch(`/api/admin/email-templates/${currentTemplate.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: editorContent,
        variants: abTestActive ? variants : null
      })
    });
  };

  const startABTest = async () => {
    await fetch(`/api/admin/email-templates/${currentTemplate.id}/ab-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variants })
    });
    setAbTestActive(true);
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [versions, setVersions] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [personalizationTags, setPersonalizationTags] = useState([]);

  // Add preview functionality
  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const renderPreview = () => {
    return (
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Template Preview
          <Select size="small" sx={{ ml: 2 }}>
            <MenuItem value="desktop">Desktop</MenuItem>
            <MenuItem value="mobile">Mobile</MenuItem>
          </Select>
        </DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: editorContent }} />
        </DialogContent>
      </Dialog>
    );
  };

  // Version control system
  const saveVersion = async () => {
    await fetch(`/api/admin/email-templates/${currentTemplate.id}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: editorContent,
        version: versions.length + 1
      })
    });
    fetchVersions();
  };

  const fetchVersions = async () => {
    const response = await fetch(`/api/admin/email-templates/${currentTemplate.id}/versions`);
    const data = await response.json();
    setVersions(data);
  };

  // Detailed A/B testing analytics
  const renderAnalytics = () => {
    if (!metrics) return null;
    return (
      <Dialog 
        open={showAnalytics} 
        onClose={() => setShowAnalytics(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>A/B Test Analytics</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LineChart width={800} height={400} data={metrics.timeSeriesData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip />
                <Line type="monotone" dataKey="openRate" stroke="#8884d8" />
                <Line type="monotone" dataKey="clickRate" stroke="#82ca9d" />
              </LineChart>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Variant Performance</Typography>
              <List>
                {metrics.variants.map(variant => (
                  <ListItem key={variant.id}>
                    <ListItemText
                      primary={`Variant ${variant.name}`}
                      secondary={`Open Rate: ${variant.openRate}% | Click Rate: ${variant.clickRate}%`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

  // Template personalization
  const addPersonalizationTag = (tag) => {
    const editor = window.tinymce.activeEditor;
    editor.insertContent(`{{${tag}}}`);
  };

  // Enhanced toolbar
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Select
              value={currentTemplate?.id || ''}
              onChange={(e) => {
                const template = templates.find(t => t.id === e.target.value);
                setCurrentTemplate(template);
                setEditorContent(template.content);
              }}
              fullWidth
            >
              {templates.map(template => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Editor
              value={editorContent}
              onEditorChange={(content) => setEditorContent(content)}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help'
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSave}>
              Save Template
            </Button>
            <Button
              variant="outlined"
              onClick={() => setAbTestActive(!abTestActive)}
              sx={{ ml: 2 }}
            >
              {abTestActive ? 'Disable A/B Test' : 'Enable A/B Test'}
            </Button>
          </Grid>

          {abTestActive && (
            <Grid item xs={12}>
              <Typography variant="h6">A/B Test Variants</Typography>
              {variants.map((variant, index) => (
                <Editor
                  key={index}
                  value={variant.content}
                  onEditorChange={(content) => {
                    const newVariants = [...variants];
                    newVariants[index].content = content;
                    setVariants(newVariants);
                  }}
                  init={{ height: 400 }}
                />
              ))}
              <Button
                variant="contained"
                onClick={startABTest}
                sx={{ mt: 2 }}
              >
                Start A/B Test
              </Button>
            </Grid>
          )}
        </Grid>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button
              startIcon={<Preview />}
              variant="outlined"
              onClick={handlePreview}
            >
              Preview
            </Button>
          </Grid>
          <Grid item>
            <Button
              startIcon={<History />}
              variant="outlined"
              onClick={saveVersion}
            >
              Save Version
            </Button>
          </Grid>
          <Grid item>
            <Button
              startIcon={<Analytics />}
              variant="outlined"
              onClick={() => setShowAnalytics(true)}
            >
              View Analytics
            </Button>
          </Grid>
          <Grid item>
            <Tooltip title="Add Personalization">
              <IconButton onClick={() => setPersonalizationTags(prev => [...prev, 'name'])}>
                <PersonAdd />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        
        {/* Personalization Tags */}
        <Box sx={{ mt: 2 }}>
          {personalizationTags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => addPersonalizationTag(tag)}
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
        {renderPreview()}
        {renderAnalytics()}
      </CardContent>
    </Card>
  );
};

export default EmailTemplateEditor;