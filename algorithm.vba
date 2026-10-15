Private Sub SugButton1_Click()
If Ans12.Value = "Y" Or Ans12.Value = "PY" Then
   If Ans11.Value = "Y" Or Ans11.Value = "PY" Or Ans11.Value = "NI" Then
       If Ans13.Value = "N" Or Ans13.Value = "PN" Or Ans13.Value = "NI" Then
       SugButton1.BackColor = RGB(0, 255, 0)
       SugButton1.Caption = "Low"
       ElseIf Ans13.Value = "Y" Or Ans13.Value = "PY" Then
       SugButton1.BackColor = RGB(255, 255, 0)
       SugButton1.Caption = "Some concerns"
       ElseIf Ans13.Value = "" Then
       SugButton1.BackColor = RGB(255, 255, 255)
       SugButton1.Caption = "Algorithm"
       End If
   ElseIf Ans11.Value = "N" Or Ans11.Value = "PN" Then
       If Ans13.Value = "Y" Or Ans13.Value = "PY" Or Ans13.Value = "N" Or Ans13.Value = "PN" Or Ans13.Value = "NI" Then
       SugButton1.BackColor = RGB(255, 255, 0)
       SugButton1.Caption = "Some concerns"
       ElseIf Ans13.Value = "" Then
       SugButton1.BackColor = RGB(255, 255, 255)
       SugButton1.Caption = "Algorithm"
       End If
    End If
ElseIf Ans12.Value = "NI" Then
   If Ans11.Value = "Y" Or Ans11.Value = "PY" Or Ans11.Value = "PN" Or Ans11.Value = "N" Or Ans11.Value = "NI" Then
       If Ans13.Value = "N" Or Ans13.Value = "PN" Or Ans13.Value = "NI" Then
       SugButton1.BackColor = RGB(255, 255, 0)
       SugButton1.Caption = "Some concerns"
       ElseIf Ans13.Value = "Y" Or Ans13.Value = "PY" Then
       SugButton1.BackColor = RGB(255, 0, 0)
       SugButton1.Caption = "High"
       ElseIf Ans13.Value = "" Then
       SugButton1.BackColor = RGB(255, 255, 255)
       SugButton1.Caption = "Algorithm"
       End If
   End If
ElseIf Ans12.Value = "N" Or Ans12.Value = "PN" Then
SugButton1.BackColor = RGB(255, 0, 0)
SugButton1.Caption = "High"
ElseIf Ans11.Value = "" Or Ans13.Value = "" Then
SugButton1.BackColor = RGB(255, 255, 255)
SugButton1.Caption = "Algorithm"
End If

End Sub

Private Sub SugButton2_Click()
Dim Part1 As String
Dim Part2 As String

If ComboBox13.Value = "" Or Question21.Value = "" Then
MsgBox "Please select the aim!"
End If

If ComboBox13.Value = "assignment to intervention (the 'intention-to-treat' effect)" Then
   If (Ans21.Value = "N" And Ans22.Value = "N") Or (Ans21.Value = "N" And Ans22.Value = "PN") Or (Ans21.Value = "PN" And Ans22.Value = "N") Or (Ans21.Value = "PN" And Ans22.Value = "PN") Then
   Part1 = "Low risk"
   ElseIf Ans21.Value = "Y" Or Ans21.Value = "PY" Or Ans21.Value = "NI" Or Ans22.Value = "Y" Or Ans22.Value = "PY" Or Ans22.Value = "NI" Then
       If Ans23.Value = "N" Or Ans23.Value = "PN" Then
       Part1 = "Low risk"
       ElseIf Ans23.Value = "NI" Then
       Part1 = "Some concerns"
       ElseIf Ans23.Value = "Y" Or Ans23.Value = "PY" Then
           If Ans24.Value = "N" Or Ans24.Value = "PN" Then
           Part1 = "Some concerns"
           ElseIf Ans24.Value = "NI" Or Ans24.Value = "Y" Or Ans24.Value = "PY" Then
               If Ans25.Value = "Y" Or Ans25.Value = "PY" Then
               Part1 = "Some concerns"
               ElseIf Ans25.Value = "N" Or Ans25.Value = "PN" Or Ans25.Value = "NI" Then
               Part1 = "High risk"
               End If
           End If
        End If
    End If
    
    If Ans26.Value = "Y" Or Ans26.Value = "PY" Then
    Part2 = "Low risk"
    ElseIf Ans26.Value = "N" Or Ans26.Value = "PN" Or Ans26.Value = "NI" Then
        If Ans27.Value = "N" Or Ans27.Value = "PN" Then
        Part2 = "Some concerns"
        ElseIf Ans27.Value = "Y" Or Ans27.Value = "PY" Or Ans27.Value = "NI" Then
        Part2 = "High risk"
        ElseIf Ans27.Value = "" Then
        Part2 = ""
        End If
    Else
    Part2 = ""
    End If
    
    If Part1 = "Low risk" And Part2 = "Low risk" Then
    SugButton2.BackColor = RGB(0, 255, 0)
    SugButton2.Caption = "Low"
    ElseIf Part1 = "High risk" Or Part2 = "High risk" And (Part1 <> "" And Part2 <> "") Then
    SugButton2.BackColor = RGB(255, 0, 0)
    SugButton2.Caption = "High"
    Else
        If Part1 <> "" And Part2 <> "" Then
        SugButton2.BackColor = RGB(255, 255, 0)
        SugButton2.Caption = "Some concerns"
        Else
        SugButton2.BackColor = RGB(255, 255, 255)
        SugButton2.Caption = "Algorithm"
        End If
    End If

ElseIf ComboBox13.Value = "adhering to intervention (the 'per-protocol' effect)" Then
    If (Ans21.Value = "N" And Ans22.Value = "N") Or (Ans21.Value = "N" And Ans22.Value = "PN") Or (Ans21.Value = "PN" And Ans22.Value = "N") Or (Ans21.Value = "PN" And Ans22.Value = "PN") Then
        If (Ans24.Value = "N" And Ans25.Value = "NA") Or (Ans24.Value = "NA" And Ans25.Value = "N") Or (Ans24.Value = "NA" And Ans25.Value = "PN") Or (Ans24.Value = "PN" And Ans25.Value = "NA") Or (Ans24.Value = "N" And Ans25.Value = "PN") Or (Ans24.Value = "PN" And Ans25.Value = "N") Or (Ans24.Value = "N" And Ans25.Value = "N") Or (Ans24.Value = "PN" And Ans25.Value = "PN") Or (Ans24.Value = "NA" And Ans25.Value = "NA") Then
        SugButton2.BackColor = RGB(0, 255, 0)
        SugButton2.Caption = "Low"
        ElseIf Ans24.Value = "Y" Or Ans24.Value = "PY" Or Ans24.Value = "NI" Or Ans25.Value = "Y" Or Ans25.Value = "PY" Or Ans25.Value = "NI" Then
            If Ans26.Value = "Y" Or Ans26.Value = "PY" Then
                    SugButton2.BackColor = RGB(255, 255, 0)
                    SugButton2.Caption = "Some concerns"
            ElseIf Ans26.Value = "N" Or Ans26.Value = "PN" Or Ans26.Value = "NI" Then
                    SugButton2.BackColor = RGB(255, 0, 0)
                    SugButton2.Caption = "High"
            End If
        End If
    ElseIf Ans21.Value = "Y" Or Ans21.Value = "PY" Or Ans21.Value = "NI" Or Ans22.Value = "Y" Or Ans22.Value = "PY" Or Ans22.Value = "NI" Then
        If Ans23.Value = "Y" Or Ans23.Value = "PY" Or Ans23.Value = "NA" Then
            If (Ans24.Value = "N" And Ans25.Value = "NA") Or (Ans24.Value = "NA" And Ans25.Value = "N") Or (Ans24.Value = "NA" And Ans25.Value = "PN") Or (Ans24.Value = "PN" And Ans25.Value = "NA") Or (Ans24.Value = "N" And Ans25.Value = "PN") Or (Ans24.Value = "PN" And Ans25.Value = "N") Or (Ans24.Value = "N" And Ans25.Value = "N") Or (Ans24.Value = "PN" And Ans25.Value = "PN") Or (Ans24.Value = "NA" And Ans25.Value = "NA") Then
            SugButton2.BackColor = RGB(0, 255, 0)
            SugButton2.Caption = "Low"
            ElseIf Ans24.Value = "Y" Or Ans24.Value = "PY" Or Ans24.Value = "NI" Or Ans25.Value = "Y" Or Ans25.Value = "PY" Or Ans25.Value = "NI" Then
                If Ans26.Value = "Y" Or Ans26.Value = "PY" Then
                        SugButton2.BackColor = RGB(255, 255, 0)
                        SugButton2.Caption = "Some concerns"
                ElseIf Ans26.Value = "N" Or Ans26.Value = "PN" Or Ans26.Value = "NI" Then
                        SugButton2.BackColor = RGB(255, 0, 0)
                        SugButton2.Caption = "High"
                End If
            End If
        ElseIf Ans23.Value = "N" Or Ans23.Value = "PN" Or Ans23.Value = "NI" Then
            If Ans26.Value = "PY" Or Ans26.Value = "Y" Then
            SugButton2.BackColor = RGB(255, 255, 0)
            SugButton2.Caption = "Some concerns"
            ElseIf Ans26.Value = "N" Or Ans26.Value = "PN" Or Ans26.Value = "NI" Then
            SugButton2.BackColor = RGB(255, 0, 0)
            SugButton2.Caption = "High"
            End If
        End If
    End If
Else
SugButton2.BackColor = RGB(255, 255, 255)
SugButton2.Caption = "Algorithm"
End If
End Sub

Private Sub SugButton3_Click()
If Ans31.Value = "Y" Or Ans31.Value = "PY" Then
SugButton3.BackColor = RGB(0, 255, 0)
SugButton3.Caption = "Low"
ElseIf Ans31.Value = "N" Or Ans31.Value = "PN" Or Ans31.Value = "NI" Then
    If Ans32.Value = "Y" Or Ans32.Value = "PY" Then
    SugButton3.BackColor = RGB(0, 255, 0)
    SugButton3.Caption = "Low"
    ElseIf Ans32.Value = "N" Or Ans32.Value = "PN" Or Ans32.Value = "NI" Then
        If Ans33.Value = "N" Or Ans33.Value = "PN" Then
        SugButton3.BackColor = RGB(0, 255, 0)
        SugButton3.Caption = "Low"
        ElseIf Ans33.Value = "Y" Or Ans33.Value = "PY" Or Ans33.Value = "NI" Then
            If Ans34.Value <> "" And (Ans34.Value = "N" Or Ans34.Value = "PN") Then
            SugButton3.BackColor = RGB(255, 255, 0)
            SugButton3.Caption = "Some concerns"
            ElseIf Ans34.Value <> "" And (Ans34.Value = "Y" Or Ans34.Value = "PY" Or Ans34.Value = "NI") Then
            SugButton3.BackColor = RGB(255, 0, 0)
            SugButton3.Caption = "High"
            ElseIf Ans34.Value = "" Then
            SugButton3.BackColor = RGB(255, 255, 255)
            SugButton3.Caption = "Algorithm"
            End If
        ElseIf Ans33.Value = "" Then
        SugButton3.BackColor = RGB(255, 255, 255)
        SugButton3.Caption = "Algorithm"
        End If
    ElseIf Ans32.Value = "" Then
    SugButton3.BackColor = RGB(255, 255, 255)
    SugButton3.Caption = "Algorithm"
    End If
ElseIf Ans31.Value = "" Then
SugButton3.BackColor = RGB(255, 255, 255)
SugButton3.Caption = "Algorithm"
End If
End Sub

Private Sub SugButton4_Click()

If Ans41.Value = "PY" Or Ans41.Value = "Y" Or Ans42.Value = "PY" Or Ans42.Value = "Y" And (Ans43.Value <> "" Or Ans44.Value <> "" Or Ans45.Value <> "") Then
SugButton4.BackColor = RGB(255, 0, 0)
SugButton4.Caption = "High"
ElseIf Ans41.Value = "N" Or Ans41.Value = "PN" Or Ans41.Value = "NI" Then
    If Ans42.Value = "N" Or Ans42.Value = "PN" Then
        If Ans43.Value = "N" Or Ans43.Value = "PN" And (Ans44.Value <> "" And Ans45.Value <> "") Then
        SugButton4.BackColor = RGB(0, 255, 0)
        SugButton4.Caption = "Low"
        ElseIf Ans43.Value = "Y" Or Ans43.Value = "PY" Or Ans43.Value = "NI" Then
            If Ans44.Value = "N" Or Ans44.Value = "PN" And Ans45.Value <> "" Then
            SugButton4.BackColor = RGB(0, 255, 0)
            SugButton4.Caption = "Low"
            ElseIf Ans44.Value = "Y" Or Ans44.Value = "PY" Or Ans44.Value = "NI" Then
                If Ans45.Value = "N" Or Ans45.Value = "PN" Then
                SugButton4.BackColor = RGB(255, 255, 0)
                SugButton4.Caption = "Some concerns"
                ElseIf Ans45.Value = "Y" Or Ans45.Value = "PY" Or Ans45.Value = "NI" Then
                SugButton4.BackColor = RGB(255, 0, 0)
                SugButton4.Caption = "High"
                ElseIf Ans45.Value = "" Then
                SugButton4.BackColor = RGB(255, 255, 255)
                SugButton4.Caption = "Algorithm"
                End If
            ElseIf Ans44.Value = "" Then
            SugButton4.BackColor = RGB(255, 255, 255)
            SugButton4.Caption = "Algorithm"
            End If
        ElseIf Ans43.Value = "" Then
        SugButton4.BackColor = RGB(255, 255, 255)
        SugButton4.Caption = "Algorithm"
        End If
    ElseIf Ans42.Value = "NI" Then
        If Ans43.Value = "N" Or Ans43.Value = "PN" And (Ans44.Value <> "" And Ans45.Value <> "") Then
        SugButton4.BackColor = RGB(255, 255, 0)
        SugButton4.Caption = "Some concerns"
        ElseIf Ans43.Value = "Y" Or Ans43.Value = "PY" Or Ans43.Value = "NI" Then
            If Ans44.Value = "N" Or Ans44.Value = "PN" And Ans45.Value <> "" Then
            SugButton4.BackColor = RGB(255, 255, 0)
            SugButton4.Caption = "Some concerns"
            ElseIf Ans44.Value = "Y" Or Ans44.Value = "PY" Or Ans44.Value = "NI" Then
                If Ans45.Value = "N" Or Ans45.Value = "PN" Then
                SugButton4.BackColor = RGB(255, 255, 0)
                SugButton4.Caption = "Some concerns"
                ElseIf Ans45.Value = "Y" Or Ans45.Value = "PY" Or Ans45.Value = "NI" Then
                SugButton4.BackColor = RGB(255, 0, 0)
                SugButton4.Caption = "High"
                ElseIf Ans45.Value = "" Then
                SugButton4.BackColor = RGB(255, 255, 255)
                SugButton4.Caption = "Algorithm"
                End If
            ElseIf Ans44.Value = "" Then
            SugButton4.BackColor = RGB(255, 255, 255)
            SugButton4.Caption = "Algorithm"
            End If
        ElseIf Ans43.Value = "" Then
        SugButton4.BackColor = RGB(255, 255, 255)
        SugButton4.Caption = "Algorithm"
        End If
    End If
End If
End Sub

Private Sub SugButton5_Click()
If (Ans53.Value = "PN" And Ans52.Value = "PN") Or (Ans53.Value = "N" And Ans52.Value = "N") Or (Ans52.Value = "N" And Ans53.Value = "PN") Or (Ans53.Value = "N" And Ans52.Value = "PN") Then
    If Ans51.Value = "Y" Or Ans51.Value = "PY" Then
    SugButton5.BackColor = RGB(0, 255, 0)
    SugButton5.Caption = "Low"
    ElseIf Ans51.Value = "N" Or Ans51.Value = "PN" Or Ans51.Value = "NI" Then
    SugButton5.BackColor = RGB(255, 255, 0)
    SugButton5.Caption = "Some concerns"
    End If
ElseIf Ans52.Value = "Y" Or Ans52.Value = "PY" Or Ans53.Value = "Y" Or Ans53.Value = "PY" And Ans51.Value <> "" Then
SugButton5.BackColor = RGB(255, 0, 0)
SugButton5.Caption = "High"
Else
    If Ans51.Value <> "" And Ans52.Value <> "" And Ans53.Value <> "" Then
    SugButton5.BackColor = RGB(255, 255, 0)
    SugButton5.Caption = "Some concerns"
    Else
    SugButton5.BackColor = RGB(255, 255, 255)
    SugButton5.Caption = "Algorithm"
    End If
'SugButton5.BackColor = RGB(255, 255, 255)
'SugButton5.Caption = "Algorithm"
End If
End Sub

Private Sub SugButton6_Click()
If Judge1.Value = "Low" And Judge2.Value = "Low" And Judge3.Value = "Low" And Judge4.Value = "Low" And Judge5.Value = "Low" Then
SugButton6.BackColor = RGB(0, 255, 0)
SugButton6.Caption = "Low"
End If
Select Case "Some concerns"
   Case Judge1.Value
   SugButton6.BackColor = RGB(255, 255, 0)
   SugButton6.Caption = "Some concerns"
   Case Judge2.Value
   SugButton6.BackColor = RGB(255, 255, 0)
   SugButton6.Caption = "Some concerns"
   Case Judge3.Value
   SugButton6.BackColor = RGB(255, 255, 0)
   SugButton6.Caption = "Some concerns"
   Case Judge4.Value
   SugButton6.BackColor = RGB(255, 255, 0)
   SugButton6.Caption = "Some concerns"
   Case Judge5.Value
   SugButton6.BackColor = RGB(255, 255, 0)
   SugButton6.Caption = "Some concerns"
End Select

Select Case "High"
   Case Judge1.Value
   SugButton6.BackColor = RGB(255, 0, 0)
   SugButton6.Caption = "High"
   Case Judge2.Value
   SugButton6.BackColor = RGB(255, 0, 0)
   SugButton6.Caption = "High"
   Case Judge3.Value
   SugButton6.BackColor = RGB(255, 0, 0)
   SugButton6.Caption = "High"
   Case Judge4.Value
   SugButton6.BackColor = RGB(255, 0, 0)
   SugButton6.Caption = "High"
   Case Judge5.Value
   SugButton6.BackColor = RGB(255, 0, 0)
   SugButton6.Caption = "High"
End Select
End Sub