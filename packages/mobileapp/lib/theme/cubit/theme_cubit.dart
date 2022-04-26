import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/screens/play/web_view_play/models/web_data.dart';

class ThemeCubit extends Cubit<Color> {
  ThemeCubit() : super(defaultColor);

  static const defaultColor = AppColors.coolBackground;

  void updateTheme(FomoNounsWebData? data) {
    emit(data!.toColor);
  }
}

extension on FomoNounsWebData {
  Color get toColor {
    switch (background) {
      case NounBackground.cool:
        return AppColors.coolBackground;
      case NounBackground.warm:
        return AppColors.warmBackground;
      default:
        return ThemeCubit.defaultColor;
    }
  }
}
